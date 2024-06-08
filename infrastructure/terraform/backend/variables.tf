variable "branch_name" {
  description = "The branch name to include in the resource names"
  type        = string
}

variable "tmdb_api_key" {
  description = "TMDB API Key"
  type        = string
}

variable "secret_key" {
  description = "Secret Key"
  type        = string
}

variable "route53_zone_id" {
  description = "The ID of the Route 53 hosted zone"
  type        = string
}