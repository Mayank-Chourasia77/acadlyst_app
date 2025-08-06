# Acadlyst - Academic Resource Sharing Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-green.svg)](https://supabase.io/)

## 🎓 About Acadlyst

Acadlyst is a modern academic resource sharing platform designed to help students collaborate, share educational materials, and enhance their learning experience. Built with cutting-edge web technologies, it provides a seamless platform for students to upload, organize, and access educational content across different courses and institutions.

### ✨ Key Features

- **📚 Resource Sharing**: Upload and share notes, lectures, and placement materials
- **🎯 Course Organization**: Browse content by specific courses and subjects  
- **👥 Group Collaboration**: Create and join study groups for enhanced collaboration
- **🏆 Leaderboard System**: Track contributions and engage with the community
- **🤖 AI Chat Assistant**: Get instant help with academic questions
- **👤 User Profiles**: Comprehensive profile system with achievements and statistics
- **🔍 Advanced Search**: Find relevant content quickly and efficiently
- **📱 Responsive Design**: Works seamlessly across all devices
- **🌙 Dark Mode**: Eye-friendly interface with theme switching
- **🔐 Secure Authentication**: Robust user authentication and authorization

## 🛠️ Technology Stack

### Frontend
- **React 18.3.1** - Modern UI library with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern, accessible UI components
- **React Router** - Client-side routing
- **React Query** - Server state management
- **React Hook Form** - Form handling with validation

### Backend & Database
- **Supabase** - Backend-as-a-Service platform
- **PostgreSQL** - Robust relational database
- **Row Level Security (RLS)** - Database-level security
- **Edge Functions** - Serverless functions for AI chat and feedback

### UI/UX
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library
- **Recharts** - Data visualization charts
- **Sonner** - Toast notifications
- **Next Themes** - Theme management

## 🚀 Getting Started

### Prerequisites

Before running this project, make sure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/acadlyst.git
cd acadlyst
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
# Copy the environment template
cp .env.example .env.local

# Edit the .env.local file with your Supabase credentials
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Start the development server**
```bash
npm run dev
```

The application will be available at `http://localhost:8080`

### Database Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the database migrations:
```bash
# Install Supabase CLI
npm install -g @supabase/cli

# Link your project
supabase link --project-ref your_project_ref

# Push the database schema
supabase db push
```

3. Set up authentication providers in your Supabase dashboard
4. Configure Row Level Security policies for data protection


## 🎯 Core Features

### 📝 Content Management
- **Upload System**: Secure file uploads with validation
- **Content Organization**: Categorize by courses, subjects, and types
- **Version Control**: Track document versions and updates
- **Access Control**: Manage permissions and sharing settings

### 👥 Community Features
- **User Profiles**: Detailed profiles with activity tracking
- **Study Groups**: Create and manage collaborative study groups
- **Leaderboards**: Gamification with contribution tracking
- **Voting System**: Community-driven content quality control

### 🤖 AI Integration
- **Smart Chat Assistant**: AI-powered help for academic queries
- **Content Recommendations**: Personalized content suggestions
- **Automated Tagging**: Intelligent content categorization

### 📊 Analytics & Insights
- **Usage Statistics**: Track platform engagement
- **Content Analytics**: Monitor popular resources
- **User Engagement**: Measure community participation

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run build:dev    # Build for development
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Database
supabase start       # Start local Supabase
supabase stop        # Stop local Supabase
supabase db reset    # Reset database
supabase gen types   # Generate TypeScript types
```

## 🔒 Security Features

- **Authentication**: Secure user authentication with Supabase Auth
- **Authorization**: Role-based access control (RBAC)
- **Data Protection**: Row Level Security (RLS) policies
- **File Security**: Secure file upload and storage
- **Input Validation**: Comprehensive input sanitization
- **Rate Limiting**: API rate limiting for abuse prevention

## 📱 Responsive Design

Acadlyst is built mobile-first with responsive design principles:
- **Mobile**: Optimized for phones (320px+)
- **Tablet**: Enhanced tablet experience (768px+)
- **Desktop**: Full desktop functionality (1024px+)
- **Large Screens**: Optimized for large displays (1440px+)

## 🤝 Contributing

We welcome contributions from the community! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
```bash
git checkout -b feature/amazing-feature
```
3. **Make your changes** and commit them
```bash
git commit -m 'Add some amazing feature'
```
4. **Push to the branch**
```bash
git push origin feature/amazing-feature
```
5. **Open a Pull Request**

### Code Standards

- Follow TypeScript best practices
- Use ESLint configuration provided
- Write descriptive commit messages
- Add tests for new features
- Update documentation as needed

## 🐛 Bug Reports & Feature Requests

- **Bug Reports**: Use GitHub Issues with the bug template
- **Feature Requests**: Use GitHub Issues with the feature template
- **Security Issues**: Email mayank.chourasia77@gmail.com

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


**Made with ❤️ by Mayank**
