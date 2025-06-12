
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: string;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { 
      hasError: true, 
      error,
      errorInfo: error.stack || error.message
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Log error details for debugging
    console.group('Error Boundary Details');
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
    console.error('Component Stack:', errorInfo.componentStack);
    console.groupEnd();
  }

  handleReload = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    window.location.reload();
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-xl text-red-600">Une erreur s'est produite</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                Nous nous excusons pour ce problème technique. L'application a rencontré une erreur inattendue.
              </p>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="bg-gray-100 p-3 rounded text-left text-xs overflow-auto max-h-32">
                  <p className="font-semibold text-red-600 mb-1">Détails de l'erreur:</p>
                  <p className="text-gray-700">{this.state.error.message}</p>
                </div>
              )}

              <div className="flex flex-col space-y-2">
                <Button 
                  onClick={this.handleReload}
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Actualiser l'application
                </Button>
                
                <Button 
                  onClick={this.handleGoHome}
                  variant="outline"
                  className="w-full"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Retour à l'accueil
                </Button>
              </div>

              <p className="text-xs text-gray-500 mt-4">
                Si le problème persiste, veuillez contacter le support technique.
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
