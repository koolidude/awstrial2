terraform {
  backend "s3" {
    bucket = "group-3-terraform-state-[branch]"
    key    = "group-3-terraform-state-[branch]/terraform.tfstate"
    region = "us-east-1"
  }
}
