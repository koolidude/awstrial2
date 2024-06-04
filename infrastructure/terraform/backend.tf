terraform {
  backend "s3" {
    bucket = "group-3-terraform-state"
    key    = "group-3-terraform-state/terraform.tfstate"
    region = "us-east-1"
  }
}
