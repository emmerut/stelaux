# Configuration
REGISTRY="emmerut"
IMAGE_NAME="stelaux-api"
REGION="us-central1"  # Corrected region name
SERVICE_NAME="stelaux-api"
MAX_INSTANCES=10
CPU="1000m"
MEMORY="512Mi"
PORT=8000

# Increment version
read -p "Enter version (e.g., v1.0): " VERSION

# Display start message
echo -e "\nStarting deployment...\n"

# Build the image with the new version
echo "Building image with version ${VERSION}..."
if docker build --build-arg VERSION=$VERSION -t ${REGISTRY}/${IMAGE_NAME}:${VERSION} .; then
    echo "Image built successfully."
else
    echo "Error: Image build failed."
    exit 1
fi

# Push the image to the registry
echo -e "\nPushing image to registry..."
if docker push ${REGISTRY}/${IMAGE_NAME}:${VERSION}; then
    echo "Image pushed successfully."
else
    echo "Error: Image push failed."
    exit 1
fi

# Deploy to Cloud Run
echo -e "\nDeploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
    --image ${REGISTRY}/${IMAGE_NAME}:${VERSION} \
    --region ${REGION} \
    --platform managed \
    --allow-unauthenticated \
    --port ${PORT} \
    --max-instances ${MAX_INSTANCES} \
    --cpu ${CPU} \
    --memory ${MEMORY} \
    --min-instances 1 \
    --set-env-vars "VERSION=${VERSION}" \
    --concurrency 80 \
    --timeout 300s

if [ $? -eq 0 ]; then
    echo -e "\nDeployment completed successfully with version ${VERSION}."
else
    echo -e "\nError: Deployment failed."
    exit 1
fi

echo -e "\nDeployment process finished."