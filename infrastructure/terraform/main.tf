provider "aws" {
  region = "us-east-1"
}

variable "branch_name" {
  description = "The branch name to include in the resource names"
  type        = string
}

resource "aws_ecr_repository" "netflix_clone" {
  name = "group-3-ecr-repo-${var.branch_name}"
}

resource "aws_ecs_cluster" "netflix_clone_cluster" {
  name = "group-3-ecs-cluster-${var.branch_name}"
}

resource "aws_ecs_task_definition" "netflix_clone_task" {
  family                   = "group-3-ecs-task-${var.branch_name}"
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
  name            = "group-3-ecs-service-${var.branch_name}"
  cluster         = aws_ecs_cluster.netflix_clone_cluster.id
  task_definition = aws_ecs_task_definition.netflix_clone_task.arn
  desired_count   = 1
  launch_type     = "FARGATE"
  network_configuration {
    subnets         = [aws_subnet.default.id]
    security_groups = [aws_security_group.default.id]
  }
}

resource "aws_vpc" "netflix_clone_vpc" {
  cidr_block = "10.0.0.0/16"
}

resource "aws_subnet" "netflix_clone_subnet" {
  vpc_id     = aws_vpc.netflix_clone_vpc.id
  cidr_block = "10.0.1.0/24"
}

resource "aws_security_group" "netflix_clone_sg" {
  vpc_id = aws_vpc.netflix_clone_vpc.id

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
