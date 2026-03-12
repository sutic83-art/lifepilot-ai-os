type LoadingCardProps = {
    message?: string;
  };
  
  export function LoadingCard({
    message = "Učitavanje..."
  }: LoadingCardProps) {
    return (
      <div className="rounded-3xl border p-6">
        {message}
      </div>
    );
  }