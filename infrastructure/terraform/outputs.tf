output "ecr_repository_url" {
  description = "URL of the ECR repository"
  value       = aws_ecr_repository.netflix_clone.repository_url
}

output "ecs_cluster_name" {
  description = "Name of the ECS cluster"
  value       = aws_ecs_cluster.netflix_clone_cluster.name
}

output "ecs_service_name" {
  description = "Name of the ECS service"
  value       = aws_ecs_service.netflix_clone_service.name
}
