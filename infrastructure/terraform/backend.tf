terraform {
  backend "s3" {
    bucket = "group-3-terraform-state-${var.branch_name}"
    key    = "group-3-terraform-state-${var.branch_name}/terraform.tfstate"
    region = "us-east-1"
  }
}
