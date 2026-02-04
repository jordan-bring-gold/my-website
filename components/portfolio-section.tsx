"use client";

import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";

import type { Project, Image as ProjectImage, Skill } from "../lib/types";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "./ui/carousel";

interface PortfolioSectionProps {
  projects?: Project[];
  skills?: Skill[];
  images?: ProjectImage[];
  hideDate?: boolean;
  hideSkills?: boolean;
}

export default function PortfolioSection({
  projects = [],
  skills = [],
  images = [],
  hideDate = false,
  hideSkills = false,
}: PortfolioSectionProps) {
  const [selectedProject, setSelectedProject] = React.useState<Project | null>(
    null,
  );

  const imagesById = React.useMemo(() => {
    if (!images) return new Map<string, ProjectImage>();
    return new Map(images.map((img) => [img.id, img]));
  }, [images]);

  const imagesByProjectId = React.useMemo(() => {
    if (!images) return new Map<string, ProjectImage[]>();
    const map = new Map<string, ProjectImage[]>();
    images.forEach((image) => {
      if (!map.has(image.projectId)) {
        map.set(image.projectId, []);
      }
      map.get(image.projectId)!.push(image);
    });
    // Sort images by order
    map.forEach((imgs) => imgs.sort((a, b) => a.order - b.order));
    return map;
  }, [images]);

  const skillsById = React.useMemo(() => {
    if (!skills) return new Map<string, Skill>();
    return new Map(skills.map((skill) => [skill.id, skill]));
  }, [skills]);

  const formatDate = (date: any) => {
    if (!date) return "No date";
    const jsDate = date instanceof Date ? date : new Date(date);
    if (isNaN(jsDate.getTime())) {
      return "Invalid Date";
    }
    return jsDate.toLocaleDateString();
  };

  return (
    <div>
      {!projects || projects.length === 0 ? (
        <div className="text-center text-muted-foreground py-12 border-2 border-dashed rounded-xl">
          <p>No projects have been added yet.</p>
        </div>
      ) : (
        <Dialog>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => {
              const thumbnail = imagesById.get(project.imageThumbnailId);
              const projectSkills = project.skillIds
                ?.map((id) => skillsById.get(id))
                .filter(Boolean) as Skill[];

              return (
                <DialogTrigger
                  asChild
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                >
                  <Card className="flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-xl cursor-pointer rounded-3xl">
                    <CardHeader className="p-0">
                      {thumbnail && (
                        <Image
                          src={
                            thumbnail.imageUrl ||
                            thumbnail.base64Content ||
                            "/placeholder.png"
                          }
                          alt={project.name}
                          width={600}
                          height={400}
                          className="aspect-video w-full object-cover"
                        />
                      )}
                    </CardHeader>
                    <CardContent className="p-6 flex-grow flex flex-col">
                      {!hideDate && (
                        <p className="text-sm text-muted-foreground">
                          {formatDate(project.date)}
                        </p>
                      )}
                      <CardTitle className="mt-2 text-xl">
                        {project.name}
                      </CardTitle>
                      <p className="mt-3 text-muted-foreground flex-grow line-clamp-2">
                        {project.shortDescription}
                      </p>
                      {!hideSkills &&
                        projectSkills &&
                        projectSkills.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {projectSkills.map((skill) => (
                              <Badge key={skill.id} variant="secondary">
                                {skill.description}
                              </Badge>
                            ))}
                          </div>
                        )}
                    </CardContent>
                  </Card>
                </DialogTrigger>
              );
            })}
          </div>
          {selectedProject && (
            <DialogContent className="max-w-2xl">
              <div className="flex flex-col space-y-6 ">
                <Carousel className="w-full">
                  <CarouselContent>
                    {(imagesByProjectId.get(selectedProject.id) || []).map(
                      (image, index) => (
                        <CarouselItem key={index}>
                          <div className="p-1">
                            <Image
                              src={
                                image.imageUrl ||
                                image.base64Content ||
                                "/placeholder.png"
                              }
                              alt={`${selectedProject.name} image ${index + 1}`}
                              width={800}
                              height={600}
                              className="w-full aspect-video object-cover rounded-lg max-h-[50vh]"
                            />
                          </div>
                        </CarouselItem>
                      ),
                    )}
                  </CarouselContent>
                  <CarouselPrevious className="left-4" />
                  <CarouselNext className="right-4" />
                </Carousel>

                <div className="flex flex-col">
                  <DialogTitle className="text-2xl font-bold">
                    {selectedProject.name}
                  </DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground mt-1">
                    {formatDate(selectedProject.date)}
                  </DialogDescription>
                  <p className="mt-4 text-muted-foreground">
                    {selectedProject.description}
                  </p>
                </div>
              </div>
            </DialogContent>
          )}
        </Dialog>
      )}
    </div>
  );
}
