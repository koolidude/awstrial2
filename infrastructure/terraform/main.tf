provider "aws" {
  region = "us-east-1"
}

variable "branch_name" {
  description = "The branch name to include in the resource names"
  type        = string
}

resource "aws_ecr_repository" "netflix_clone" {
  name = "Group-3-ecr-repo-${var.branch_name}"
}

resource "aws_ecs_cluster" "netflix_clone_cluster" {
  name = "Group-3-ecs-cluster-${var.branch_name}"
}

resource "aws_ecs_task_definition" "netflix_clone_task" {
  family                   = "Group-3-ecs-task-${var.branch_name}"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
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

resource "aws_ecs_service" "netflix_clone_service" {
  name            = "Group-3-ecs-service-${var.branch_name}"
  cluster         = aws_ecs_cluster.netflix_clone_cluster.id
  task_definition = aws_ecs_task_definition.netflix_clone_task.arn
  desired_count   = 1
  launch_type     = "FARGATE"
  network_configuration {
    subnets         = [aws_subnet.default.id]
    security_groups = [aws_security_group.default.id]
  }
}

resource "aws_subnet" "default" {
  vpc_id     = "YOUR_VPC_ID"
  cidr_block = "10.0.1.0/24"
}

resource "aws_security_group" "default" {
  vpc_id = "YOUR_VPC_ID"

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
