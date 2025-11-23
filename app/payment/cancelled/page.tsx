import Link from "next/link";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

export default function CancelledPage() {
  return (
    <main className="min-h-screen bg-[#F6D6CA] flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-white rounded-[32px] p-12 max-w-md w-full shadow-xl flex flex-col items-center border-2 border-brand-primary/10">
        <div className="mb-6 text-brand-primary">
            <XCircle size={64} />
        </div>
        
        <h1 className="text-3xl font-serif font-bold text-brand-primary mb-4">Payment Cancelled</h1>
        <p className="text-brand-primary/70 font-medium mb-8">
          No worries! You haven't been charged. You can continue using the free version of BalloonSight.
        </p>

        <Link href="/">
          <Button variant="outline" className="h-12 px-8 rounded-full border-2 border-brand-primary/20 text-brand-primary font-bold hover:bg-brand-primary/5">
            Return to Home
          </Button>
        </Link>
      </div>
    </main>
  );
}

