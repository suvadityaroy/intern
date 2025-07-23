# CodeSecure - AI-Powered Vulnerability Scanner

AI-generated code ships fast—and often ships vulnerable. CodeSecure aims to give founders a one-click layer that scans their repos, flags weaknesses, and offers instant fixes so they can ship with confidence.

## 🚀 Features

### Core Functionality
- **Code Intake**: Connect GitHub repositories, upload files, or paste code directly
- **Vulnerability Scan**: AI-powered analysis detecting common security issues
- **Fix on Demand**: Generate actionable fixes for each vulnerability
- **Result Presentation**: Clean dashboard with prioritized findings
- **Audit History**: Store scans and fixes for future reference

### Security Vulnerabilities Detected
- **SQL Injection**: Detects potential SQL injection vulnerabilities
- **Cross-Site Scripting (XSS)**: Identifies XSS-prone code patterns
- **Hardcoded Secrets**: Finds exposed API keys, passwords, and tokens
- **Weak Cryptography**: Detects use of deprecated hash functions
- **Insecure Random**: Identifies use of Math.random() for security purposes
- **Eval Usage**: Flags dangerous eval() function usage
- **Missing CSRF Protection**: Detects forms without CSRF tokens
- **Insecure Headers**: Identifies missing security headers

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Database**: Supabase (PostgreSQL)
- **GitHub Integration**: Octokit REST API
- **Deployment**: Vercel (recommended)

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- GitHub account (for repository scanning)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd codsecure
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# GitHub Configuration (optional, for private repos)
GITHUB_TOKEN=your_github_personal_access_token
```

### 4. Database Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the following schema:

```sql
-- Create projects table
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('github', 'upload', 'paste')),
  repo_url TEXT,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'scanning' CHECK (status IN ('scanning', 'completed', 'failed'))
);

-- Create files table
CREATE TABLE files (
  id TEXT PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  path TEXT NOT NULL,
  content TEXT NOT NULL,
  hash TEXT NOT NULL
);

-- Create findings table
CREATE TABLE findings (
  id TEXT PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  file_id TEXT REFERENCES files(id) ON DELETE CASCADE,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  message TEXT NOT NULL,
  code_snippet TEXT NOT NULL,
  line_number INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create fixes table
CREATE TABLE fixes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  finding_id TEXT REFERENCES findings(id) ON DELETE CASCADE,
  diff TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'applied', 'rejected'))
);

-- Create indexes for better performance
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_findings_project_id ON findings(project_id);
CREATE INDEX idx_findings_severity ON findings(severity);
CREATE INDEX idx_files_project_id ON files(project_id);
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📖 Usage Guide

### 1. Start a New Scan

1. **GitHub Repository**: Enter a public GitHub repository URL
2. **Paste Code**: Directly paste your code for instant analysis
3. **Upload Files**: Upload code files (coming soon)

### 2. Review Findings

- View prioritized vulnerabilities by severity
- See code snippets with line numbers
- Check file paths and affected areas

### 3. Request Fixes

- Click "Request Fix" for any finding
- Review the generated fix
- Download the patch as a diff file

### 4. Track Progress

- View scan history and results
- Monitor project status
- Access previous fixes

## 🎯 KPIs & Targets

- **Scan Success Rate**: ≥ 90%
- **Average Time to First Finding**: < 10 minutes
- **Repos Fully Fixed End-to-End**: ≥ 3 test repos
- **Demo-window Uptime**: 100%
- **Internal Usability Score**: ≥ 4/5

## 🔧 Configuration

### Custom Vulnerability Rules

You can add custom vulnerability patterns in `src/lib/vulnerability-scanner.ts`:

```typescript
const customRules: VulnerabilityRule[] = [
  {
    id: 'custom-rule',
    name: 'Custom Vulnerability',
    description: 'Description of the vulnerability',
    severity: 'high',
    pattern: /your-regex-pattern/gi,
    fixSuggestion: 'How to fix this vulnerability'
  }
]
```

### GitHub Integration

For private repositories, set up a GitHub Personal Access Token:

1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate a new token with `repo` scope
3. Add it to your `.env.local` file

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🧪 Testing

### Sample Vulnerable Code

Test the scanner with this sample code:

```javascript
// SQL Injection vulnerability
const query = "SELECT * FROM users WHERE id = " + userId;

// XSS vulnerability
document.getElementById('output').innerHTML = userInput;

// Hardcoded secret
const apiKey = "sk-1234567890abcdef";

// Weak cryptography
const hash = md5(password);

// Insecure random
const token = Math.random().toString(36);
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Roadmap

- [ ] File upload functionality
- [ ] Advanced AI-powered analysis
- [ ] Integration with CI/CD pipelines
- [ ] Custom rule creation UI
- [ ] Team collaboration features
- [ ] Advanced reporting and analytics
- [ ] Integration with security tools
- [ ] Mobile application

---

**Built with ❤️ for secure code development**
