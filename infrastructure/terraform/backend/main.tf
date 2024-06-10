provider "aws" {
  region = "us-east-1"
}

# VPC
# The VPC is the main networking component where all resources will be launched.
resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
  enable_dns_support = true
  enable_dns_hostnames = true
  tags = {
    Name = "group-3-vpc-${var.branch_name}"
  }
}

# Internet Gateway
# The Internet Gateway enables the VPC to connect to the internet.
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id
  tags = {
    Name = "group-3-igws-${var.branch_name}"
  }
}

# Route Table
# The Route Table manages the routes for the VPC, allowing traffic to the internet via the Internet Gateway.
resource "aws_route_table" "main" {
  vpc_id = aws_vpc.main.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }
  tags = {
    Name = "group-3-rt-${var.branch_name}"
  }
}

# Public Subnets
# Public subnets are subnets with a direct route to the internet.
resource "aws_subnet" "public1" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "us-east-1a"
  map_public_ip_on_launch = true
  tags = {
    Name = "group-3-public-sbnt1-${var.branch_name}"
  }
}

resource "aws_subnet" "public2" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "us-east-1b"
  map_public_ip_on_launch = true
  tags = {
    Name = "group-3-public-sbnt2-${var.branch_name}"
  }
}

# Private Subnets
# Private subnets are subnets without a direct route to the internet.
resource "aws_subnet" "private1" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.3.0/24"
  availability_zone = "us-east-1a"
  tags = {
    Name = "group-3-private-sbnt1-${var.branch_name}"
  }
}

resource "aws_subnet" "private2" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.4.0/24"
  availability_zone = "us-east-1b"
  tags = {
    Name = "group-3-private-sbnt2-${var.branch_name}"
  }
}

# Associate Subnets with Route Table
# These associations link the public subnets with the main route table.
resource "aws_route_table_association" "public1" {
  subnet_id      = aws_subnet.public1.id
  route_table_id = aws_route_table.main.id
}

resource "aws_route_table_association" "public2" {
  subnet_id      = aws_subnet.public2.id
  route_table_id = aws_route_table.main.id
}

# Security Group
# The Security Group acts as a virtual firewall to control inbound and outbound traffic.
resource "aws_security_group" "main" {
  name        = "group-3-sg-${var.branch_name}"
  description = "Security group for group-3-${var.branch_name}"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 5000
    to_port     = 5000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "group-3-sg-${var.branch_name}"
  }
}

# Application Load Balancer (ALB)
# The ALB distributes incoming application traffic across multiple targets.
resource "aws_lb" "main" {
  name               = "group-3-alb-${var.branch_name}"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.main.id]
  subnets            = [aws_subnet.public1.id, aws_subnet.public2.id]

  enable_deletion_protection = false
}

# ALB Target Group
# The Target Group is used to route requests to one or more registered targets.
resource "aws_lb_target_group" "main" {
  name     = "group-3-tg-${var.branch_name}"
  port     = 5000
  protocol = "HTTP"
  vpc_id   = aws_vpc.main.id
  target_type = "ip"
  health_check {
    path                = "/"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
    matcher             = "200-399"
  }
}

# ALB Listener
# The Listener defines the protocol and port that the load balancer uses to listen for incoming connections.
resource "aws_lb_listener" "main" {
  load_balancer_arn = aws_lb.main.arn
  port              = "5000"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = aws_acm_certificate.cert.arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.main.arn
  }
}

# ECS Task Execution Role
# The IAM Role that the ECS tasks will use to call AWS services.
resource "aws_iam_role" "ecs_task_execution_role" {
  name = "group-3-ecs-task-execution-role-${var.branch_name}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })

  lifecycle {
    ignore_changes = [
      name
    ]
  }
}

# ECS Task Execution Policy
# Attaches the required policy to the ECS Task Execution Role.
resource "aws_iam_role_policy_attachment" "ecs_task_execution_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# ECS CloudWatch Logs Policy
# Attaches the CloudWatch Logs policy to the ECS Task Execution Role for logging.
resource "aws_iam_role_policy_attachment" "ecs_cloudwatch_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchLogsFullAccess"
}

# ECR Repository
# The ECR repository to store Docker images.
resource "aws_ecr_repository" "netflix_clone" {
  name = "group-3-ecr-repo-${var.branch_name}"
}

# ECS Cluster
# The ECS Cluster where the services will be deployed.
resource "aws_ecs_cluster" "netflix_clone_cluster" {
  name = "group-3-ecs-cluster-${var.branch_name}"
}

# ECS Task Definition
# Defines the ECS Task with container settings.
resource "aws_ecs_task_definition" "netflix_clone_task" {
  family                   = "group-3-ecs-task-${var.branch_name}"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  container_definitions = jsonencode([
    {
      name      = "backend"
      image     = "${aws_ecr_repository.netflix_clone.repository_url}:latest"
      cpu       = 256
      memory    = 512
      essential = true
      portMappings = [
        {
          containerPort = 5000
          hostPort      = 5000
        }
      ]
      environment = [
        {
          name  = "TMDB_API_KEY"
          value = var.tmdb_api_key
        },
        {
          name  = "SECRET_KEY"
          value = var.secret_key
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = "/ecs/group-3-${var.branch_name}"
          "awslogs-region"        = "us-east-1"
          "awslogs-stream-prefix" = "ecs"
        }
      }
    }
  ])
}

# ECS Service
# The ECS Service to manage the running of the tasks.
resource "aws_ecs_service" "netflix_clone_service" {
  name            = "group-3-ecs-service-${var.branch_name}"
  cluster         = aws_ecs_cluster.netflix_clone_cluster.id
  task_definition = aws_ecs_task_definition.netflix_clone_task.arn
  desired_count   = 1
  launch_type     = "FARGATE"
  network_configuration {
    subnets         = [aws_subnet.private1.id, aws_subnet.private2.id]
    security_groups = [aws_security_group.main.id]
  }
  load_balancer {
    target_group_arn = aws_lb_target_group.main.arn
    container_name   = "backend"
    container_port   = 5000
  }
  depends_on = [
    aws_lb_listener.main
  ]
}

# CloudWatch Log Group
# The Log Group to store ECS logs in CloudWatch.
resource "aws_cloudwatch_log_group" "ecs_log_group" {
  name              = "/ecs/group-3-${var.branch_name}"
  retention_in_days = 7
}

# VPC Endpoint for ECR
# Allows the ECS tasks to pull images from ECR privately.
resource "aws_vpc_endpoint" "ecr" {
  vpc_id            = aws_vpc.main.id
  service_name      = "com.amazonaws.us-east-1.ecr.api"
  subnet_ids        = [aws_subnet.private1.id, aws_subnet.private2.id]
  security_group_ids = [aws_security_group.main.id]
  vpc_endpoint_type = "Interface"

  tags = {
    Name = "group-3-ep-ecr-${var.branch_name}"
  }
}

# VPC Endpoint for ECR Docker
# Allows the ECS tasks to pull images from ECR Docker privately.
resource "aws_vpc_endpoint" "ecr_dkr" {
  vpc_id            = aws_vpc.main.id
  service_name      = "com.amazonaws.us-east-1.ecr.dkr"
  subnet_ids        = [aws_subnet.private1.id, aws_subnet.private2.id]
  security_group_ids = [aws_security_group.main.id]
  vpc_endpoint_type = "Interface"
  tags = {
    Name = "group-3-ep-ecrdkr-${var.branch_name}"
  }
}

# NAT Gateway
# Allows instances in the private subnets to access the internet.
resource "aws_eip" "nat" {
  vpc = true
  tags = {
    Name = "group-3-eip-${var.branch_name}"
  }
}

resource "aws_nat_gateway" "nat" {
  allocation_id = aws_eip.nat.id
  subnet_id     = aws_subnet.public1.id
  tags = {
    Name = "group-3-nat-gw-${var.branch_name}"
  }
}

# Private Route Table
# Route table for private subnets to route traffic through the NAT Gateway.
resource "aws_route_table" "private" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat.id
  }

  tags = {
    Name = "group-3-private-rt-${var.branch_name}"
  }
}

# Associate Private Subnets with Private Route Table
resource "aws_route_table_association" "private1" {
  subnet_id      = aws_subnet.private1.id
  route_table_id = aws_route_table.private.id
}

resource "aws_route_table_association" "private2" {
  subnet_id      = aws_subnet.private2.id
  route_table_id = aws_route_table.private.id
}

# ACM Certificate
resource "aws_acm_certificate" "cert" {
  domain_name       = "group-3-backend.sctp-sandbox.com"
  validation_method = "DNS"
  
  subject_alternative_names = [
    "group-3-backend.sctp-sandbox.com",
  ]

  tags = {
    Name = "group-3-backend"
  }
}

resource "aws_route53_record" "cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.cert.domain_validation_options : dvo.domain_name => {
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

resource "aws_acm_certificate_validation" "cert" {
  certificate_arn         = aws_acm_certificate.cert.arn
  validation_record_fqdns = [for record in aws_route53_record.cert_validation : record.fqdn]
}
