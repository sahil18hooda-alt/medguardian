import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";

export function DoctorList() {
  const doctors = PlaceHolderImages.filter(img => img.id.startsWith("doc"));

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4 font-headline">Recommended Specialists</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {doctors.map((doctor, index) => (
          <Card key={doctor.id} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center gap-4 p-4">
              <Image
                src={doctor.imageUrl}
                alt={doctor.description}
                width={64}
                height={64}
                className="rounded-full border-2 border-primary"
                data-ai-hint={doctor.imageHint}
              />
              <div className="grid gap-1">
                <CardTitle className="text-base">{doctor.description.split(',')[0]}</CardTitle>
                <p className="text-sm text-muted-foreground">{doctor.description.split(',')[1]}</p>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
               <Badge variant="secondary">95% Match</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
