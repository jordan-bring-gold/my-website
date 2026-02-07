"use client";

import Image from "next/image";
import { DialogContent, DialogDescription, DialogTitle } from "./ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "./ui/carousel";
import { CustomScroll } from "./ui/custom-scroll";
import type { Project, Image as ProjectImage } from "../lib/types";

interface ProjectPopupProps {
  project: Project;
  images: ProjectImage[];
}

const formatDate = (date: any) => {
  if (!date) return "No date";
  const jsDate = date instanceof Date ? date : new Date(date);
  if (isNaN(jsDate.getTime())) {
    return "Invalid Date";
  }
  return jsDate.toLocaleDateString();
};

export default function ProjectPopup({ project, images }: ProjectPopupProps) {
  return (
    <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col pr-5">
      <CustomScroll className="flex flex-col space-y-6 pr-1 pt-1">
        <Carousel className="w-full flex-shrink-0">
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Image
                    src={
                      image.imageUrl ||
                      image.base64Content ||
                      "/placeholder.png"
                    }
                    alt={`${project.name} image ${index + 1}`}
                    width={800}
                    height={600}
                    className="w-full aspect-video object-cover rounded-lg max-h-[50vh]"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>

        <div className="flex flex-col">
          <DialogTitle className="text-2xl font-bold">
            {project.name}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-1">
            {formatDate(project.date)}
          </DialogDescription>
          <p className="mt-4 text-muted-foreground">{project.description}</p>
        </div>
      </CustomScroll>
    </DialogContent>
  );
}
