provider "aws" {
  region = "us-east-1"
}

# IAM Role for S3 bucket policy management
resource "aws_iam_role" "s3_bucket_policy_role" {
  name = "group-3-s3-bucket-policy-role"

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
  name   = "group-3-s3-bucket-policy"
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

# S3 Bucket to store the frontend files
resource "aws_s3_bucket" "frontend" {
  bucket = "group-3-frontend-${var.branch_name}"

  website {
    index_document = "index.html"
  }
}

# Uploading frontend build files to S3 bucket
resource "aws_s3_object" "frontend" {
  for_each = fileset("frontend/build", "**/*")

  bucket = aws_s3_bucket.frontend.bucket
  key    = each.value
  source = "frontend/build/${each.value}"
}

# Policy to allow public read access to the S3 bucket
resource "aws_s3_bucket_policy" "frontend_bucket_policy" {
  bucket = aws_s3_bucket.frontend.bucket

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Sid: "PublicReadGetObject",
        Effect = "Allow",
        Principal: "*",
        Action: "s3:GetObject",
        Resource: "arn:aws:s3:::${aws_s3_bucket.frontend.bucket}/*"
      }
    ]
  })
}

# CloudFront distribution for serving the frontend content
resource "aws_cloudfront_distribution" "frontend" {
  origin {
    domain_name = aws_s3_bucket.frontend.bucket_regional_domain_name
    origin_id   = "S3-${aws_s3_bucket.frontend.id}"
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

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
    cloudfront_default_certificate = true
  }

  tags = {
    Name = "group-3-cloudfront-${var.branch_name}"
  }
}

#TEST
#TEST
#TEST