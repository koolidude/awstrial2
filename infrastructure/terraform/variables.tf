variable "aws_region" {
  description = "The AWS region to deploy to"
  type        = string
  default     = "us-east-1"
}

variable "branch_name" {
  description = "The branch name to include in the resource names"
  type        = string
}
