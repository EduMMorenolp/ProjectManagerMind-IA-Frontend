# Guía de Despliegue

## 🚀 Estrategias de Deployment

ProjectManagerMind IA está diseñado para ser desplegado en múltiples entornos con diferentes estrategias según las necesidades del proyecto. Esta guía cubre desde desarrollo local hasta producción empresarial.

## 🏗️ Arquitectura de Despliegue

### Componentes del Sistema

```mermaid
graph TB
    subgraph "Frontend (Vite + React)"
        FE[Static Files]
        FE_CONFIG[Environment Config]
    end
    
    subgraph "Backend (Node.js + Express)"
        BE[API Server]
        BE_CONFIG[Environment Variables]
    end
    
    subgraph "Database"
        DB[(PostgreSQL)]
        MIGRATIONS[Prisma Migrations]
    end
    
    subgraph "External Services"
        GEMINI[Google Gemini API]
        OPENAI[OpenAI API]
        FILE_STORAGE[File Storage]
    end
    
    FE --> BE
    BE --> DB
    BE --> MIGRATIONS
    BE --> GEMINI
    BE --> OPENAI
    BE --> FILE_STORAGE
```

### Entornos de Despliegue

1. **Desarrollo Local** - Docker Compose
2. **Staging** - Cloud con CI/CD
3. **Producción** - Contenedores orquestados
4. **Empresarial** - On-premise con alta disponibilidad

## 🐳 Despliegue con Docker

### Docker Compose para Desarrollo

```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  # Base de datos
  postgres:
    image: postgres:15-alpine
    container_name: projectmind-db-dev
    environment:
      POSTGRES_DB: projectmind_dev
      POSTGRES_USER: developer
      POSTGRES_PASSWORD: dev_password_123
    ports:
      - "5432:5432"
    volumes:
      - postgres_dev_data:/var/lib/postgresql/data
      - ./backend/prisma/init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U developer -d projectmind_dev"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Backend API
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.dev
    container_name: projectmind-api-dev
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://developer:dev_password_123@postgres:5432/projectmind_dev
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - PORT=3000
      - CORS_ORIGIN=http://localhost:5173
    ports:
      - "3000:3000"
    volumes:
      - ./backend:/app
      - /app/node_modules
      - ./backend/uploads:/app/uploads
      - ./backend/temp:/app/temp
    depends_on:
      postgres:
        condition: service_healthy
    command: npm run dev
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Frontend (Desarrollo)
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.dev
    container_name: projectmind-frontend-dev
    environment:
      - VITE_API_URL=http://localhost:3000
      - VITE_ENV=development
    ports:
      - "5173:5173"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    depends_on:
      - backend
    command: npm run dev -- --host 0.0.0.0

volumes:
  postgres_dev_data:
```

### Dockerfiles

```dockerfile
# backend/Dockerfile.dev
FROM node:18-alpine

WORKDIR /app

# Instalar dependencias del sistema
RUN apk add --no-cache curl

# Copiar package files
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependencias
RUN npm ci

# Generar Prisma Client
RUN npx prisma generate

# Copiar código fuente
COPY . .

# Crear directorios necesarios
RUN mkdir -p uploads temp output

# Exponer puerto
EXPOSE 3000

# Comando por defecto
CMD ["npm", "run", "dev"]
```

```dockerfile
# frontend/Dockerfile.dev
FROM node:18-alpine

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Exponer puerto
EXPOSE 5173

# Comando por defecto
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
```

### Dockerfile de Producción

```dockerfile
# backend/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Instalar dependencias del sistema
RUN apk add --no-cache python3 make g++

# Copiar package files
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependencias
RUN npm ci --only=production

# Generar Prisma Client
RUN npx prisma generate

# Etapa de producción
FROM node:18-alpine AS production

WORKDIR /app

# Instalar curl para healthchecks
RUN apk add --no-cache curl

# Crear usuario no-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Copiar dependencias desde builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

# Copiar código fuente
COPY . .

# Crear directorios necesarios con permisos
RUN mkdir -p uploads temp output && \
    chown -R nodejs:nodejs uploads temp output

# Cambiar a usuario no-root
USER nodejs

# Exponer puerto
EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Comando por defecto
CMD ["npm", "start"]
```

```dockerfile
# frontend/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Build de producción
RUN npm run build

# Etapa de producción con nginx
FROM nginx:alpine AS production

# Copiar configuración de nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar archivos construidos
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponer puerto
EXPOSE 80

# Comando por defecto
CMD ["nginx", "-g", "daemon off;"]
```

### Configuración de Nginx

```nginx
# frontend/nginx.conf
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                   '$status $body_bytes_sent "$http_referer" '
                   '"$http_user_agent" "$http_x_forwarded_for"';
    access_log /var/log/nginx/access.log main;

    # Performance
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
        add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

        # Handle client-side routing
        location / {
            try_files $uri $uri/ /index.html;
        }

        # API proxy
        location /api/ {
            proxy_pass http://backend:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # Static assets with long-term caching
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Security - deny access to sensitive files
        location ~ /\. {
            deny all;
        }
    }
}
```

## ☁️ Despliegue en Cloud

### AWS con ECS

```yaml
# aws/task-definition.json
{
  "family": "projectmind-task",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "1024",
  "memory": "2048",
  "executionRoleArn": "arn:aws:iam::ACCOUNT:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::ACCOUNT:role/ecsTaskRole",
  "containerDefinitions": [
    {
      "name": "projectmind-backend",
      "image": "your-registry/projectmind-backend:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ],
      "secrets": [
        {
          "name": "DATABASE_URL",
          "valueFrom": "arn:aws:secretsmanager:region:account:secret:projectmind/database-url"
        },
        {
          "name": "GEMINI_API_KEY",
          "valueFrom": "arn:aws:secretsmanager:region:account:secret:projectmind/gemini-key"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/projectmind",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "backend"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "curl -f http://localhost:3000/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 60
      }
    },
    {
      "name": "projectmind-frontend",
      "image": "your-registry/projectmind-frontend:latest",
      "portMappings": [
        {
          "containerPort": 80,
          "protocol": "tcp"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/projectmind",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "frontend"
        }
      }
    }
  ]
}
```

### Terraform para Infraestructura

```hcl
# terraform/main.tf
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# VPC y Networking
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "projectmind-vpc"
  }
}

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "projectmind-igw"
  }
}

resource "aws_subnet" "public" {
  count = 2

  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.${count.index + 1}.0/24"
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name = "projectmind-public-${count.index + 1}"
  }
}

resource "aws_subnet" "private" {
  count = 2

  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.${count.index + 10}.0/24"
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = {
    Name = "projectmind-private-${count.index + 1}"
  }
}

# RDS para PostgreSQL
resource "aws_db_subnet_group" "main" {
  name       = "projectmind-db-subnet-group"
  subnet_ids = aws_subnet.private[*].id

  tags = {
    Name = "ProjectMind DB subnet group"
  }
}

resource "aws_db_instance" "postgres" {
  identifier = "projectmind-postgres"

  allocated_storage     = 20
  max_allocated_storage = 100
  storage_type          = "gp2"
  storage_encrypted     = true

  engine         = "postgres"
  engine_version = "15.4"
  instance_class = "db.t3.micro"

  db_name  = "projectmind"
  username = "projectmind_admin"
  password = var.db_password

  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name

  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"

  skip_final_snapshot = true
  deletion_protection = false

  tags = {
    Name = "projectmind-postgres"
  }
}

# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "projectmind-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = {
    Name = "projectmind-cluster"
  }
}

# Application Load Balancer
resource "aws_lb" "main" {
  name               = "projectmind-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = aws_subnet.public[*].id

  enable_deletion_protection = false

  tags = {
    Name = "projectmind-alb"
  }
}

resource "aws_lb_target_group" "backend" {
  name        = "projectmind-backend-tg"
  port        = 3000
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "ip"

  health_check {
    enabled             = true
    healthy_threshold   = 2
    unhealthy_threshold = 2
    timeout             = 5
    interval            = 30
    path                = "/health"
    matcher             = "200"
  }

  tags = {
    Name = "projectmind-backend-tg"
  }
}

resource "aws_lb_target_group" "frontend" {
  name        = "projectmind-frontend-tg"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "ip"

  health_check {
    enabled             = true
    healthy_threshold   = 2
    unhealthy_threshold = 2
    timeout             = 5
    interval            = 30
    path                = "/"
    matcher             = "200"
  }

  tags = {
    Name = "projectmind-frontend-tg"
  }
}

# ECS Service
resource "aws_ecs_service" "main" {
  name            = "projectmind-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.main.arn
  desired_count   = 2
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = aws_subnet.private[*].id
    security_groups  = [aws_security_group.ecs_tasks.id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.backend.arn
    container_name   = "projectmind-backend"
    container_port   = 3000
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.frontend.arn
    container_name   = "projectmind-frontend"
    container_port   = 80
  }

  depends_on = [aws_lb_listener.main]

  tags = {
    Name = "projectmind-service"
  }
}
```

## 🔄 CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  workflow_dispatch:

env:
  AWS_REGION: us-east-1
  ECR_REGISTRY: your-account.dkr.ecr.us-east-1.amazonaws.com

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install backend dependencies
        run: |
          cd backend
          npm ci

      - name: Install frontend dependencies
        run: |
          cd frontend
          npm ci

      - name: Run backend tests
        run: |
          cd backend
          npm run test

      - name: Run frontend tests
        run: |
          cd frontend
          npm run test:run

      - name: Run E2E tests
        run: |
          cd frontend
          npm run test:e2e

  build-and-push:
    needs: test
    runs-on: ubuntu-latest
    outputs:
      backend-image: ${{ steps.build-backend.outputs.backend-image }}
      frontend-image: ${{ steps.build-frontend.outputs.frontend-image }}
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1

      - name: Build and push backend image
        id: build-backend
        run: |
          cd backend
          IMAGE_TAG=${GITHUB_SHA::8}
          BACKEND_IMAGE=$ECR_REGISTRY/projectmind-backend:$IMAGE_TAG
          
          docker build -t $BACKEND_IMAGE .
          docker push $BACKEND_IMAGE
          
          echo "backend-image=$BACKEND_IMAGE" >> $GITHUB_OUTPUT

      - name: Build and push frontend image
        id: build-frontend
        run: |
          cd frontend
          IMAGE_TAG=${GITHUB_SHA::8}
          FRONTEND_IMAGE=$ECR_REGISTRY/projectmind-frontend:$IMAGE_TAG
          
          # Build con variables de entorno de producción
          docker build \
            --build-arg VITE_API_URL=${{ secrets.PROD_API_URL }} \
            --build-arg VITE_ENV=production \
            -t $FRONTEND_IMAGE .
          
          docker push $FRONTEND_IMAGE
          
          echo "frontend-image=$FRONTEND_IMAGE" >> $GITHUB_OUTPUT

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    environment: production
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Update task definition
        run: |
          # Descargar task definition actual
          aws ecs describe-task-definition \
            --task-definition projectmind-task \
            --query taskDefinition > task-definition.json

          # Actualizar imágenes en task definition
          jq --arg BACKEND_IMAGE "${{ needs.build-and-push.outputs.backend-image }}" \
             --arg FRONTEND_IMAGE "${{ needs.build-and-push.outputs.frontend-image }}" \
             '.containerDefinitions[0].image = $BACKEND_IMAGE | 
              .containerDefinitions[1].image = $FRONTEND_IMAGE |
              del(.taskDefinitionArn, .revision, .status, .requiresAttributes, .placementConstraints, .compatibilities, .registeredAt, .registeredBy)' \
             task-definition.json > new-task-definition.json

      - name: Deploy to ECS
        run: |
          # Registrar nueva task definition
          aws ecs register-task-definition \
            --cli-input-json file://new-task-definition.json

          # Actualizar servicio
          aws ecs update-service \
            --cluster projectmind-cluster \
            --service projectmind-service \
            --task-definition projectmind-task

          # Esperar que el deployment complete
          aws ecs wait services-stable \
            --cluster projectmind-cluster \
            --services projectmind-service

      - name: Run database migrations
        run: |
          # Ejecutar migraciones en un task temporal
          aws ecs run-task \
            --cluster projectmind-cluster \
            --task-definition projectmind-migrations \
            --launch-type FARGATE \
            --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx,subnet-yyy],securityGroups=[sg-xxx],assignPublicIp=DISABLED}"

  notify:
    needs: [test, build-and-push, deploy]
    runs-on: ubuntu-latest
    if: always()
    
    steps:
      - name: Notify deployment status
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: |
            Deployment to production: ${{ job.status }}
            Backend Image: ${{ needs.build-and-push.outputs.backend-image }}
            Frontend Image: ${{ needs.build-and-push.outputs.frontend-image }}
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

### Pipeline de Migraciones

```yaml
# .github/workflows/migrations.yml
name: Database Migrations

on:
  workflow_call:
    inputs:
      environment:
        required: true
        type: string

jobs:
  migrate:
    runs-on: ubuntu-latest
    environment: ${{ inputs.environment }}
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: |
          cd backend
          npm ci

      - name: Run migrations
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
        run: |
          cd backend
          npx prisma migrate deploy
          npx prisma generate

      - name: Verify migrations
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
        run: |
          cd backend
          npx prisma migrate status
```

## 🔧 Scripts de Deployment

### Script de Deploy Local

```bash
#!/bin/bash
# scripts/deploy-local.sh

set -e

echo "🚀 Iniciando deploy local..."

# Verificar que Docker esté corriendo
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker no está corriendo"
    exit 1
fi

# Limpiar contenedores anteriores
echo "🧹 Limpiando contenedores anteriores..."
docker-compose -f docker-compose.dev.yml down --volumes --remove-orphans

# Construir imágenes
echo "🏗️ Construyendo imágenes..."
docker-compose -f docker-compose.dev.yml build --no-cache

# Iniciar servicios
echo "🌟 Iniciando servicios..."
docker-compose -f docker-compose.dev.yml up -d

# Esperar a que la base de datos esté lista
echo "⏳ Esperando a que PostgreSQL esté listo..."
until docker-compose -f docker-compose.dev.yml exec -T postgres pg_isready -U developer -d projectmind_dev; do
    sleep 2
done

# Ejecutar migraciones
echo "🗄️ Ejecutando migraciones..."
docker-compose -f docker-compose.dev.yml exec -T backend npx prisma migrate deploy

# Verificar que los servicios estén funcionando
echo "🔍 Verificando servicios..."
sleep 10

# Backend health check
if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ Backend funcionando correctamente"
else
    echo "❌ Backend no responde"
    docker-compose -f docker-compose.dev.yml logs backend
    exit 1
fi

# Frontend health check
if curl -f http://localhost:5173 > /dev/null 2>&1; then
    echo "✅ Frontend funcionando correctamente"
else
    echo "❌ Frontend no responde"
    docker-compose -f docker-compose.dev.yml logs frontend
    exit 1
fi

echo "🎉 Deploy local completado exitosamente!"
echo "📱 Frontend: http://localhost:5173"
echo "🔗 Backend API: http://localhost:3000"
echo "🗄️ Base de datos: postgresql://developer:dev_password_123@localhost:5432/projectmind_dev"

# Mostrar logs en tiempo real
echo "📋 Mostrando logs (Ctrl+C para salir)..."
docker-compose -f docker-compose.dev.yml logs -f
```

### Script de Deploy Staging

```bash
#!/bin/bash
# scripts/deploy-staging.sh

set -e

echo "🚀 Iniciando deploy a staging..."

# Verificar variables de entorno
required_vars=("AWS_ACCESS_KEY_ID" "AWS_SECRET_ACCESS_KEY" "ECR_REGISTRY")
for var in "${required_vars[@]}"; do
    if [[ -z "${!var}" ]]; then
        echo "❌ Variable de entorno $var no está definida"
        exit 1
    fi
done

# Login a ECR
echo "🔐 Haciendo login a ECR..."
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $ECR_REGISTRY

# Build y push de imágenes
echo "🏗️ Construyendo y subiendo imágenes..."
IMAGE_TAG="staging-$(date +%Y%m%d-%H%M%S)"

# Backend
cd backend
docker build -t $ECR_REGISTRY/projectmind-backend:$IMAGE_TAG .
docker push $ECR_REGISTRY/projectmind-backend:$IMAGE_TAG
cd ..

# Frontend
cd frontend
docker build \
    --build-arg VITE_API_URL=https://api-staging.projectmind.com \
    --build-arg VITE_ENV=staging \
    -t $ECR_REGISTRY/projectmind-frontend:$IMAGE_TAG .
docker push $ECR_REGISTRY/projectmind-frontend:$IMAGE_TAG
cd ..

# Actualizar task definition
echo "📝 Actualizando task definition..."
aws ecs describe-task-definition \
    --task-definition projectmind-staging-task \
    --query taskDefinition > current-task-def.json

jq --arg BACKEND_IMAGE "$ECR_REGISTRY/projectmind-backend:$IMAGE_TAG" \
   --arg FRONTEND_IMAGE "$ECR_REGISTRY/projectmind-frontend:$IMAGE_TAG" \
   '.containerDefinitions[0].image = $BACKEND_IMAGE |
    .containerDefinitions[1].image = $FRONTEND_IMAGE |
    del(.taskDefinitionArn, .revision, .status, .requiresAttributes, .placementConstraints, .compatibilities, .registeredAt, .registeredBy)' \
   current-task-def.json > new-task-def.json

# Registrar nueva task definition
aws ecs register-task-definition --cli-input-json file://new-task-def.json

# Actualizar servicio
echo "🔄 Actualizando servicio ECS..."
aws ecs update-service \
    --cluster projectmind-staging-cluster \
    --service projectmind-staging-service \
    --task-definition projectmind-staging-task

# Esperar deployment
echo "⏳ Esperando que el deployment complete..."
aws ecs wait services-stable \
    --cluster projectmind-staging-cluster \
    --services projectmind-staging-service

echo "✅ Deploy a staging completado exitosamente!"
echo "🌐 URL: https://staging.projectmind.com"

# Limpiar archivos temporales
rm -f current-task-def.json new-task-def.json
```

## 📊 Monitoreo y Logs

### Configuración de CloudWatch

```json
{
  "logs": {
    "logs_collected": {
      "files": {
        "collect_list": [
          {
            "file_path": "/var/log/nginx/access.log",
            "log_group_name": "/aws/ecs/projectmind/nginx/access",
            "log_stream_name": "{instance_id}",
            "timestamp_format": "%d/%b/%Y:%H:%M:%S %z"
          },
          {
            "file_path": "/var/log/nginx/error.log",
            "log_group_name": "/aws/ecs/projectmind/nginx/error",
            "log_stream_name": "{instance_id}"
          }
        ]
      }
    }
  },
  "metrics": {
    "namespace": "ProjectMind/Application",
    "metrics_collected": {
      "cpu": {
        "measurement": [
          "cpu_usage_idle",
          "cpu_usage_iowait",
          "cpu_usage_user",
          "cpu_usage_system"
        ],
        "metrics_collection_interval": 60
      },
      "disk": {
        "measurement": [
          "used_percent"
        ],
        "metrics_collection_interval": 60,
        "resources": [
          "*"
        ]
      },
      "mem": {
        "measurement": [
          "mem_used_percent"
        ],
        "metrics_collection_interval": 60
      }
    }
  }
}
```

### Dashboard de Monitoreo

```javascript
// scripts/monitoring-dashboard.js
const AWS = require('aws-sdk');
const cloudwatch = new AWS.CloudWatch({ region: 'us-east-1' });

async function createDashboard() {
    const dashboardBody = {
        widgets: [
            {
                type: "metric",
                properties: {
                    metrics: [
                        ["AWS/ECS", "CPUUtilization", "ServiceName", "projectmind-service"],
                        [".", "MemoryUtilization", ".", "."]
                    ],
                    period: 300,
                    stat: "Average",
                    region: "us-east-1",
                    title: "ECS Service Metrics"
                }
            },
            {
                type: "metric",
                properties: {
                    metrics: [
                        ["AWS/ApplicationELB", "RequestCount", "LoadBalancer", "projectmind-alb"],
                        [".", "TargetResponseTime", ".", "."],
                        [".", "HTTPCode_Target_2XX_Count", ".", "."],
                        [".", "HTTPCode_Target_4XX_Count", ".", "."],
                        [".", "HTTPCode_Target_5XX_Count", ".", "."]
                    ],
                    period: 300,
                    stat: "Sum",
                    region: "us-east-1",
                    title: "Load Balancer Metrics"
                }
            },
            {
                type: "log",
                properties: {
                    query: "SOURCE '/aws/ecs/projectmind' | fields @timestamp, @message\n| filter @message like /ERROR/\n| sort @timestamp desc\n| limit 100",
                    region: "us-east-1",
                    title: "Error Logs",
                    view: "table"
                }
            }
        ]
    };

    const params = {
        DashboardName: 'ProjectMind-Production',
        DashboardBody: JSON.stringify(dashboardBody)
    };

    try {
        await cloudwatch.putDashboard(params).promise();
        console.log('Dashboard creado exitosamente');
    } catch (error) {
        console.error('Error creando dashboard:', error);
    }
}

createDashboard();
```

## 🔒 Configuración de Seguridad

### Secrets Management

```yaml
# secrets.yml (ejemplo para AWS Secrets Manager)
secrets:
  database_url:
    type: "rds_connection_string"
    description: "PostgreSQL connection string"
    rotation_enabled: true
    rotation_interval: 30
    
  gemini_api_key:
    type: "external_api_key"
    description: "Google Gemini API Key"
    rotation_enabled: false
    
  openai_api_key:
    type: "external_api_key"
    description: "OpenAI API Key"
    rotation_enabled: false
    
  jwt_secret:
    type: "application_secret"
    description: "JWT signing secret"
    rotation_enabled: true
    rotation_interval: 90
```

### Security Groups

```hcl
# terraform/security-groups.tf
resource "aws_security_group" "alb" {
  name_prefix = "projectmind-alb-"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
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
    Name = "projectmind-alb-sg"
  }
}

resource "aws_security_group" "ecs_tasks" {
  name_prefix = "projectmind-ecs-tasks-"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port       = 3000
    to_port         = 3000
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  ingress {
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "projectmind-ecs-tasks-sg"
  }
}
```

---

**Mantenido por**: Equipo de DevOps y Infraestructura  
**Última actualización**: Octubre 2025  
**Entornos soportados**: Local, Staging, Producción