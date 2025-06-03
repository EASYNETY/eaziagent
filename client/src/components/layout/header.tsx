interface HeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function Header({ title, description, action }: HeaderProps) {
  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
          {description && (
            <p className="text-gray-600 dark:text-gray-400 mt-1">{description}</p>
          )}
        </div>
        {action && (
          <div className="flex items-center space-x-4">
            {action}
          </div>
        )}
      </div>
    </header>
  );
}
