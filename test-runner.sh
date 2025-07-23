#!/bin/bash
# test-runner.sh - Comprehensive test runner for RootRise

echo "🌱 RootRise Testing Suite 🌱"
echo "============================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from your project root."
    exit 1
fi

# Check if hardhat is installed
if ! npx hardhat --version &> /dev/null; then
    print_error "Hardhat not found. Please install it first:"
    echo "npm install --save-dev hardhat"
    exit 1
fi

# Function to run smart contract tests
run_contract_tests() {
    print_status "Running smart contract tests..."
    
    if npx hardhat test; then
        print_success "✅ Smart contract tests passed!"
    else
        print_error "❌ Smart contract tests failed!"
        return 1
    fi
}

# Function to run smart contract tests with gas reporting
run_gas_tests() {
    print_status "Running gas usage analysis..."
    
    if REPORT_GAS=true npx hardhat test; then
        print_success "✅ Gas analysis completed!"
    else
        print_error "❌ Gas analysis failed!"
        return 1
    fi
}

# Function to run coverage tests
run_coverage() {
    print_status "Running test coverage analysis..."
    
    if npx hardhat coverage; then
        print_success "✅ Coverage analysis completed!"
        print_status "Coverage report available in coverage/index.html"
    else
        print_error "❌ Coverage analysis failed!"
        return 1
    fi
}

# Function to run frontend tests
run_frontend_tests() {
    print_status "Running frontend tests..."
    
    if npm run test:frontend; then
        print_success "✅ Frontend tests passed!"
    else
        print_warning "⚠️  Frontend tests failed or not configured"
        return 1
    fi
}

# Function to run E2E tests
run_e2e_tests() {
    print_status "Running E2E tests..."
    
    if npm run test:e2e; then
        print_success "✅ E2E tests passed!"
    else
        print_warning "⚠️  E2E tests failed or not configured"
        return 1
    fi
}

# Function to compile contracts
compile_contracts() {
    print_status "Compiling smart contracts..."
    
    if npx hardhat compile; then
        print_success "✅ Contracts compiled successfully!"
    else
        print_error "❌ Contract compilation failed!"
        return 1
    fi
}

# Function to check code quality
check_code_quality() {
    print_status "Running code quality checks..."
    
    # Check if ESLint is available
    if command -v npx eslint &> /dev/null; then
        print_status "Running ESLint..."
        if npx eslint . --ext .ts,.tsx,.js,.jsx; then
            print_success "✅ ESLint passed!"
        else
            print_warning "⚠️  ESLint found issues"
        fi
    fi
    
    # Check if Prettier is available
    if command -v npx prettier &> /dev/null; then
        print_status "Checking code formatting..."
        if npx prettier --check .; then
            print_success "✅ Code formatting is correct!"
        else
            print_warning "⚠️  Code needs formatting (run: npm run format)"
        fi
    fi
}

# Function to run security checks
run_security_checks() {
    print_status "Running security analysis..."
    
    # Check if slither is available for smart contract security
    if command -v slither &> /dev/null; then
        print_status "Running Slither security analysis..."
        if slither .; then
            print_success "✅ Slither security check passed!"
        else
            print_warning "⚠️  Slither found potential security issues"
        fi
    else
        print_warning "⚠️  Slither not installed. Install with: pip3 install slither-analyzer"
    fi
    
    # Check for npm audit
    print_status "Running npm security audit..."
    if npm audit --audit-level moderate; then
        print_success "✅ No security vulnerabilities found!"
    else
        print_warning "⚠️  Security vulnerabilities detected. Run: npm audit fix"
    fi
}

# Function to check dependencies
check_dependencies() {
    print_status "Checking dependencies..."
    
    # Check for outdated packages
    if npm outdated; then
        print_warning "⚠️  Some packages are outdated"
    else
        print_success "✅ All packages are up to date!"
    fi
}

# Function to run all tests
run_all_tests() {
    print_status "Running comprehensive test suite..."
    echo ""
    
    local failed_tests=0
    
    # Compile contracts first
    if ! compile_contracts; then
        ((failed_tests++))
    fi
    echo ""
    
    # Run smart contract tests
    if ! run_contract_tests; then
        ((failed_tests++))
    fi
    echo ""
    
    # Run frontend tests (if they exist)
    if [ -f "__tests__" ] || [ -f "src/__tests__" ] || [ -f "test" ]; then
        if ! run_frontend_tests; then
            ((failed_tests++))
        fi
        echo ""
    fi
    
    # Run code quality checks
    check_code_quality
    echo ""
    
    # Run security checks
    run_security_checks
    echo ""
    
    # Check dependencies
    check_dependencies
    echo ""
    
    # Summary
    echo "================================"
    echo "🎯 TEST SUMMARY"
    echo "================================"
    
    if [ $failed_tests -eq 0 ]; then
        print_success "🎉 All tests passed! Your RootRise platform is ready!"
    else
        print_error "❌ $failed_tests test suite(s) failed. Please check the output above."
        exit 1
    fi
}

# Function to clean artifacts
clean_artifacts() {
    print_status "Cleaning build artifacts..."
    
    rm -rf artifacts/
    rm -rf cache/
    rm -rf coverage/
    rm -rf typechain-types/
    rm -rf .next/
    rm -rf node_modules/.cache/
    
    print_success "✅ Artifacts cleaned!"
}

# Function to setup test environment
setup_test_env() {
    print_status "Setting up test environment..."
    
    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        print_status "Installing dependencies..."
        npm install
    fi
    
    # Compile contracts
    compile_contracts
    
    print_success "✅ Test environment ready!"
}

# Function to show help
show_help() {
    echo ""
    echo "🌱 RootRise Test Runner Usage:"
    echo "================================"
    echo ""
    echo "Commands:"
    echo "  ./test-runner.sh                 - Run all tests"
    echo "  ./test-runner.sh --contracts     - Run only smart contract tests"
    echo "  ./test-runner.sh --gas           - Run tests with gas reporting"
    echo "  ./test-runner.sh --coverage      - Run coverage analysis"
    echo "  ./test-runner.sh --frontend      - Run frontend tests"
    echo "  ./test-runner.sh --e2e           - Run E2E tests"
    echo "  ./test-runner.sh --security      - Run security checks"
    echo "  ./test-runner.sh --clean         - Clean build artifacts"
    echo "  ./test-runner.sh --setup         - Setup test environment"
    echo "  ./test-runner.sh --help          - Show this help"
    echo ""
    echo "Examples:"
    echo "  ./test-runner.sh --contracts --gas"
    echo "  ./test-runner.sh --clean && ./test-runner.sh"
    echo ""
}

# Main execution logic
main() {
    case "${1:-all}" in
        --contracts)
            setup_test_env
            run_contract_tests
            ;;
        --gas)
            setup_test_env
            run_gas_tests
            ;;
        --coverage)
            setup_test_env
            run_coverage
            ;;
        --frontend)
            run_frontend_tests
            ;;
        --e2e)
            run_e2e_tests
            ;;
        --security)
            run_security_checks
            ;;
        --clean)
            clean_artifacts
            ;;
        --setup)
            setup_test_env
            ;;
        --help)
            show_help
            ;;
        all|"")
            setup_test_env
            run_all_tests
            ;;
        *)
            print_error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
}

# Make the script executable and run
if [ "${BASH_SOURCE[0]}" == "${0}" ]; then
    main "$@"
fi