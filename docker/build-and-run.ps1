# Build the docker image with the current git version, sha and build date
$ocularBuildVersion = git describe --tags --abbrev=0
$ocularBuildShaShort = git rev-parse --short HEAD
$ocularBuildDate = (Get-Date).ToUniversalTime().ToString('o')

docker build `
	--build-arg "OCULAR_BUILD_VERSION=$ocularBuildVersion" `
	--build-arg "OCULAR_BUILD_SHA=$ocularBuildShaShort" `
	--build-arg "OCULAR_BUILD_DATE=$ocularBuildDate" `
	-t ocular `
	-f .\docker\Dockerfile `
	.

# Run the container with a random JWT secret and a user created
$randomBytes = [byte[]]::new(48)
$randomNumberGenerator = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$randomNumberGenerator.GetBytes($randomBytes)
$randomNumberGenerator.Dispose()

$jwtSecret = [Convert]::ToBase64String($randomBytes)

docker run `
	--publish 3030:80 `
	--volume "${PWD}\genesis\.data:/data/genesis" `
	--env "GENESIS_JWT_SECRET=$jwtSecret" `
	--env "GENESIS_JWT_TOKEN_EXPIRATION=60" `
	--env "GENESIS_CREATE_USERS=admin!:hgEiPCZP" `
	ocular
