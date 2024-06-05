provider "aws" {
  region = "us-east-1"
}

variable "branch_name" {
  description = "The branch name to include in the resource names"
  type        = string
}

data "aws_vpcs" "existing_vpcs" {}

resource "aws_vpc" "netflix_clone_vpc" {
  count = length([for vpc in data.aws_vpcs.existing_vpcs.ids : vpc if vpc.tags["Name"] == "group-3-vpc-${var.branch_name}"]) == 0 ? 1 : 0

  cidr_block = "10.0.0.0/16"

  tags = {
    Name = "group-3-vpc-${var.branch_name}"
  }
}

data "aws_subnets" "existing_subnets" {}

resource "aws_subnet" "netflix_clone_subnet" {
  count = length([for subnet in data.aws_subnets.existing_subnets.ids : subnet if subnet.tags["Name"] == "group-3-subnet-${var.branch_name}"]) == 0 ? 1 : 0

  vpc_id     = aws_vpc.netflix_clone_vpc.id
  cidr_block = "10.0.1.0/24"

  tags = {
    Name = "group-3-subnet-${var.branch_name}"
  }
}

data "aws_security_groups" "existing_sgs" {}

resource "aws_security_group" "netflix_clone_sg" {
  count = length([for sg in data.aws_security_groups.existing_sgs.ids : sg if sg.tags["Name"] == "group-3-sg-${var.branch_name}"]) == 0 ? 1 : 0

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

  tags = {
    Name = "group-3-sg-${var.branch_name}"
  }
}

data "aws_iam_role" "existing_role" {
  name = "group-3-ecs-task-execution-role-${var.branch_name}"
}

resource "aws_iam_role" "ecs_task_execution_role" {
  count = length(data.aws_iam_role.existing_role.id) == 0 ? 1 : 0

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
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

data "aws_ecr_repository" "existing_repo" {
  name = "group-3-ecr-repo-${var.branch_name}"
}

resource "aws_ecr_repository" "netflix_clone" {
  count = length(data.aws_ecr_repository.existing_repo.id) == 0 ? 1 : 0

  name = "group-3-ecr-repo-${var.branch_name}"
}

data "aws_ecs_clusters" "existing_clusters" {}

resource "aws_ecs_cluster" "netflix_clone_cluster" {
  count = length([for cluster in data.aws_ecs_clusters.existing_clusters.ids : cluster if cluster.tags["Name"] == "group-3-ecs-cluster-${var.branch_name}"]) == 0 ? 1 : 0

  name = "group-3-ecs-cluster-${var.branch_name}"
}

data "aws_ecs_task_definition" "existing_task" {
  task_definition = "group-3-ecs-task-${var.branch_name}"
}

resource "aws_ecs_task_definition" "netflix_clone_task" {
  count = length(data.aws_ecs_task_definition.existing_task.task_definition) == 0 ? 1 : 0

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

data "aws_ecs_services" "existing_services" {}

resource "aws_ecs_service" "netflix_clone_service" {
  count = length([for service in data.aws_ecs_services.existing_services.names : service if service == "group-3-ecs-service-${var.branch_name}"]) == 0 ? 1 : 0

  name            = "group-3-ecs-service-${var.branch_name}"
  cluster         = aws_ecs_cluster.netflix_clone_cluster.id
  task_definition = aws_ecs_task_definition.netflix_clone_task.arn
  desired_count   = 1
  launch_type     = "FARGATE"
  network_configuration {
    subnets         = [aws_subnet.netflix_clone_subnet.id]
    security_groups = [aws_security_group.netflix_clone_sg.id]
  }
}
