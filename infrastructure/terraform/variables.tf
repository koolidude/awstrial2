variable "aws_region" {
  description = "The AWS region to deploy to"
  type        = string
  default     = "us-east-1"
}

variable "subnet_id" {
  description = "The ID of the subnet to deploy to"
  type        = string
}

variable "security_group_id" {
  description = "The ID of the security group"
  type        = string
}

variable "branch_name" {
  description = "The branch name to include in the resource names"
  type        = string
}
