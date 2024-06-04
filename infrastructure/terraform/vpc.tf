resource "aws_vpc" "netflix_clone_vpc" {
  cidr_block = "10.0.0.0/16"
  tags = {
    Name = "group-3-vpc-${var.branch_name}"
  }
}

resource "aws_subnet" "netflix_clone_subnet" {
  vpc_id            = aws_vpc.netflix_clone_vpc.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "us-east-1a"
  tags = {
    Name = "group-3-subnet-${var.branch_name}"
  }
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

  tags = {
    Name = "group-3-sg-${var.branch_name}"
  }
}
