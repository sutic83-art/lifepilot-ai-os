type ErrorCardProps = {
    message: string;
  };
  
  export function ErrorCard({ message }: ErrorCardProps) {
    return (
      <div className="rounded-3xl border border-red-300 p-6 text-red-600">
        {message}
      </div>
    );
  }