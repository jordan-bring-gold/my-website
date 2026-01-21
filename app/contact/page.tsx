'use client';

import { Github, Linkedin, Mail } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import * as React from 'react';
import { useToast } from "@/hooks/use-toast";
import type { UserProfile } from '@/lib/types';

// Import default company data
import defaultCompanyData from '@/data/companies/default.json';

export default function ContactPage() {
    const { toast } = useToast();
    const companyData = defaultCompanyData;
    const userProfile = companyData?.userProfile;
    
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [subject, setSubject] = React.useState('');
    const [message, setMessage] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        console.log('Form submitting:', { name, email, subject, message });

        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, subject, message }),
            });
            console.log("Response status:", response);

            if (response.ok) {
                console.log("Email sent successfully")
                toast({ title: "Message Sent!", description: "Thanks for reaching out. I'll get back to you soon." });
                setName('');
                setEmail('');
                setSubject('');
                setMessage('');
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            console.error("Fetch error:", error);
            toast({ title: "Uh oh!", description: "Something went wrong. Please try again.", variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
                <div>
                    <h1 className="text-4xl font-headline font-extrabold tracking-tight lg:text-5xl">Get in Touch</h1>
                    <p className="mt-4 text-xl text-muted-foreground">
                        I'm always open to discussing new projects, creative ideas or opportunities to be part of an ambitious vision.
                    </p>
                    <div className="mt-8 space-y-4">
                        {userProfile?.contactEmail && (
                            <a href={`mailto:${userProfile.contactEmail}`} className="flex items-center gap-4 text-lg group">
                                <Mail className="h-6 w-6 text-primary" />
                                <span className="group-hover:text-primary transition-colors">{userProfile.contactEmail}</span>
                            </a>
                        )}
                        {userProfile?.githubUrl && (
                            <a href={userProfile.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-lg group">
                                <Github className="h-6 w-6 text-primary" />
                                <span className="group-hover:text-primary transition-colors">GitHub</span>
                            </a>
                        )}
                        {userProfile?.linkedinUrl && (
                            <a href={userProfile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-lg group">
                                <Linkedin className="h-6 w-6 text-primary" />
                                <span className="group-hover:text-primary transition-colors">LinkedIn</span>
                            </a>
                        )}
                    </div>
                </div>
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Send me a Message</CardTitle>
                            <CardDescription>Fill out the form below and I'll get back to you as soon as possible.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form className="space-y-4" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input id="name" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="subject">Subject</Label>
                                    <Input id="subject" placeholder="What's this about?" value={subject} onChange={(e) => setSubject(e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="message">Message</Label>
                                    <Textarea id="message" placeholder="Your message..." className="min-h-[120px]" value={message} onChange={(e) => setMessage(e.target.value)} required />
                                </div>
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? 'Sending...' : 'Send Message'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
