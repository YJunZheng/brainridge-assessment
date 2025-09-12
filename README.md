# BrainRidge Banking - Takehome Assessment

This project is created for the BrainRidge assessment.

## Prerequisites

- **Node.js** (version 18.x or higher)
- **Angular CLI** (installed globally)

```bash
# Install Angular CLI globally
npm install -g @angular/cli
```

## Building the App

### 1. Clone the Repository

```bash
git clone https://github.com/YJunZheng/brainridge-assessment.git
cd brainridge-assessment/app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Development Server

```bash
npm start
# or
ng serve
```

The application will be available at `http://localhost:4200/`

### 4. Build for Production

```bash
npm run build
# or
ng build
```

## Application Structure

```
app/
├── src/
│   ├── app/
│   │   ├── core/                    # Core services
│   │   │   └── services/
│   │   │       ├── data.service.ts  # Main data management
│   │   │       └── toast.service.ts # Notifications
│   │   ├── features/                # Feature modules
│   │   │   ├── accounts/
│   │   │   │   └── components/
│   │   │   │       ├── account-list/      # View all accounts
│   │   │   │       └── account-creation/  # Create new account
│   │   │   └── transactions/
│   │   │       └── components/
│   │   │           ├── fund-transfer/     # Transfer funds
│   │   │           └── transaction-history/ # View history
│   │   ├── shared/                  # Shared components
│   │   │   ├── components/
│   │   │   │   ├── custom-button/   # Reusable button
│   │   │   │   ├── header/          # Navigation
│   │   │   │   └── toasts/          # Toast notifications
│   │   │   └── models/              # Data models
│   │   └── app.routes.ts            # Route configuration
│   └── styles.scss                  # Global styles
```