provider "aws" {
  region = "us-east-1"
}

variable "branch_name" {
  description = "The branch name to include in the resource names"
  type        = string
}

# VPC
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true
  tags = {
    Name = "group-3-vpc-${var.branch_name}"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id
  tags = {
    Name = "group-3-igw-${var.branch_name}"
  }
}

# NAT Gateway
resource "aws_eip" "nat" {
  vpc = true
}

resource "aws_nat_gateway" "main" {
  allocation_id = aws_eip.nat.id
  subnet_id     = aws_subnet.public.id
  tags = {
    Name = "group-3-nat-${var.branch_name}"
  }
}

# Public Subnet
resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "us-east-1a"
  map_public_ip_on_launch = true
  tags = {
    Name = "group-3-public-subnet-${var.branch_name}"
  }
}

# Private Subnet 1
resource "aws_subnet" "private1" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "us-east-1b"
  tags = {
    Name = "group-3-private-subnet1-${var.branch_name}"
  }
}

# Private Subnet 2
resource "aws_subnet" "private2" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.3.0/24"
  availability_zone = "us-east-1c"
  tags = {
    Name = "group-3-private-subnet2-${var.branch_name}"
  }
}

# Public Route Table
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = {
    Name = "group-3-public-rt-${var.branch_name}"
  }
}

# Private Route Table
resource "aws_route_table" "private" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.main.id
  }

  tags = {
    Name = "group-3-private-rt-${var.branch_name}"
  }
}

# Associate Subnets with Route Tables
resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "private1" {
  subnet_id      = aws_subnet.private1.id
  route_table_id = aws_route_table.private.id
}

resource "aws_route_table_association" "private2" {
  subnet_id      = aws_subnet.private2.id
  route_table_id = aws_route_table.private.id
}

# Security Group
resource "aws_security_group" "main" {
  name        = "group-3-sg-${var.branch_name}"
  description = "Security group for group-3-${var.branch_name}"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
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

# ALB
resource "aws_lb" "main" {
  name               = "group-3-alb-${var.branch_name}"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.main.id]
  subnets            = [aws_subnet.public.id]

  enable_deletion_protection = false
}

# ALB Target Group
resource "aws_lb_target_group" "main" {
  name     = "group-3-tg-${var.branch_name}"
  port     = 80
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
resource "aws_lb_listener" "main" {
  load_balancer_arn = aws_lb.main.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.main.arn
  }
}

# ECS Task Execution Role
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
resource "aws_iam_role_policy_attachment" "ecs_task_execution_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# ECR Repository
resource "aws_ecr_repository" "netflix_clone" {
  name = "group-3-ecr-repo-${var.branch_name}"
}

# ECS Cluster
resource "aws_ecs_cluster" "netflix_clone_cluster" {
  name = "group-3-ecs-cluster-${var.branch_name}"
}

# ECS Task Definition
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
          containerPort = 80
          hostPort      = 80
        }
      ]
    }
  ])
}

# ECS Service
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
    container_port   = 80
  }
  depends_on = [
    aws_lb_listener.main
  ]
}

# VPC Endpoint for ECR
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
