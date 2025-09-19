interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
}

const Button = ({ children, variant = 'primary', isLoading, className = '', ...props }: ButtonProps) => {
  const baseClasses = 'px-4 py-2 font-medium rounded-lg transition-colors focus:outline-none disabled:opacity-50';
  
  const variantClasses = {
    primary: 'bg-gray-900 text-white hover:bg-gray-800',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    danger: 'bg-red-600 text-white hover:bg-red-700'
  };
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
          Loading...
        </div>
      ) : children}
    </button>
  );
};

export default Button;

export default Button