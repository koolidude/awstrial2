provider "aws" {
  region = "us-east-1"
}

# IAM Role for S3 bucket policy management
resource "aws_iam_role" "s3_bucket_policy_role" {
  name = "group-3-s3-bucket-policy-role-${var.branch_name}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = {
          Service = "ec2.amazonaws.com"
        },
        Action = "sts:AssumeRole"
      }
    ]
  })
}

# Attach Policy to IAM Role
resource "aws_iam_role_policy" "s3_bucket_policy" {
  name   = "group-3-s3-bucket-policy-${var.branch_name}"
  role   = aws_iam_role.s3_bucket_policy_role.id
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "s3:PutBucketPolicy",
          "s3:GetBucketPolicy",
          "s3:GetObject"
        ],
        Resource = [
          "arn:aws:s3:::group-3-frontend-${var.branch_name}",
          "arn:aws:s3:::group-3-frontend-${var.branch_name}/*"
        ]
      }
    ]
  })
}

# Create IAM policy for managing CloudFront and Route53
resource "aws_iam_policy" "cloudfront_route53_policy" {
  name        = "group-3-cloudfront-route53-policy"
  description = "Policy for managing CloudFront and Route53 resources"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "cloudfront:CreateDistribution",
          "cloudfront:UpdateDistribution",
          "cloudfront:GetDistribution",
          "cloudfront:DeleteDistribution",
          "cloudfront:ListDistributions",
          "cloudfront:CreateInvalidation",
          "cloudfront:GetInvalidation",
          "cloudfront:ListInvalidations"
        ],
        Resource = "*"
      },
      {
        Effect = "Allow",
        Action = [
          "route53:ListHostedZones",
          "route53:GetHostedZone",
          "route53:CreateHostedZone",
          "route53:DeleteHostedZone",
          "route53:ChangeResourceRecordSets",
          "route53:ListResourceRecordSets",
          "route53:GetChange"
        ],
        Resource = "*"
      },
      {
        Effect = "Allow",
        Action = [
          "s3:ListBucket",
          "s3:GetBucketLocation",
          "s3:CreateBucket",
          "s3:DeleteBucket",
          "s3:PutBucketPolicy",
          "s3:GetBucketPolicy",
          "s3:PutObject",
          "s3:GetObject",
          "s3:DeleteObject"
        ],
        Resource = [
          "arn:aws:s3:::group-3-frontend-${var.branch_name}",
          "arn:aws:s3:::group-3-frontend-${var.branch_name}/*"
        ]
      }
    ]
  })
}

# Attach CloudFront and Route53 policy to IAM role
resource "aws_iam_role_policy_attachment" "cloudfront_route53_policy_attachment" {
  role       = aws_iam_role.s3_bucket_policy_role.name
  policy_arn = aws_iam_policy.cloudfront_route53_policy.arn
}

# S3 Bucket to store the frontend files
resource "aws_s3_bucket" "frontend" {
  bucket = "group-3-frontend-${var.branch_name}"

  website {
    index_document = "index.html"
    error_document = "error.html"
  }
}

# Uploading frontend build files to S3 bucket
resource "aws_s3_object" "frontend" {
  for_each = fileset("frontend/build", "**/*")

  bucket = aws_s3_bucket.frontend.bucket
  key    = each.value
  source = "frontend/build/${each.value}"
}

# Create SSL Certificate with ACM
resource "aws_acm_certificate" "frontend" {
  domain_name       = "group-3-frontend-${var.branch_name}.sctp-sandbox.com"
  validation_method = "DNS"

  tags = {
    Name = "group-3-acm-${var.branch_name}"
  }
}

resource "aws_route53_record" "cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.frontend.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      type   = dvo.resource_record_type
      record = dvo.resource_record_value
    }
  }

  zone_id = var.route53_zone_id
  name    = each.value.name
  type    = each.value.type
  records = [each.value.record]
  ttl     = 60
}

resource "aws_acm_certificate_validation" "frontend" {
  certificate_arn         = aws_acm_certificate.frontend.arn
  validation_record_fqdns = [for record in aws_route53_record.cert_validation : record.fqdn]
}

# CloudFront Origin Access Identity
resource "aws_cloudfront_origin_access_identity" "origin_access_identity" {
  comment = "OAI for group-3-frontend-${var.branch_name}"
}

# CloudFront distribution for serving the frontend content
resource "aws_cloudfront_distribution" "frontend" {
  origin {
    domain_name = aws_s3_bucket.frontend.bucket_regional_domain_name
    origin_id   = "S3-${aws_s3_bucket.frontend.id}"
    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.origin_access_identity.cloudfront_access_identity_path
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  aliases = ["group-3-frontend-${var.branch_name}.sctp-sandbox.com"]

  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${aws_s3_bucket.frontend.id}"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn            = aws_acm_certificate.frontend.arn
    ssl_support_method             = "sni-only"
    minimum_protocol_version       = "TLSv1.2_2019"
    cloudfront_default_certificate = false
  }

  tags = {
    Name = "group-3-cloudfront-${var.branch_name}"
  }
}

# Route53 A record pointing to CloudFront distribution
resource "aws_route53_record" "frontend_alias" {
  zone_id = var.route53_zone_id
  name    = "group-3-frontend-${var.branch_name}.sctp-sandbox.com"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.frontend.domain_name
    zone_id                = aws_cloudfront_distribution.frontend.hosted_zone_id
    evaluate_target_health = false
  }
}

#TEST
#TEST