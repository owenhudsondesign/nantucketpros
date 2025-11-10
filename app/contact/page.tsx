"use client";

import { useState } from "react";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setSubmitStatus({
        type: "success",
        message: data.message || "Message sent successfully!",
      });
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error: any) {
      setSubmitStatus({
        type: "error",
        message: error.message || "Failed to send message. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Get in Touch
              </h1>
              <p className="text-xl text-muted-foreground">
                We're here to help. Send us a message and we'll respond as soon as possible.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="border-t border-border/40 py-20 md:py-24 bg-muted/20">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-border/40 rounded-lg p-8">
                {submitStatus && (
                  <div
                    className={`p-4 rounded-md ${
                      submitStatus.type === "success"
                        ? "bg-green-50 text-green-800 border border-green-200"
                        : "bg-red-50 text-red-800 border border-red-200"
                    }`}
                  >
                    {submitStatus.message}
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-foreground"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-foreground"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-foreground"
                    required
                    disabled={isSubmitting}
                  >
                    <option value="">Select a topic</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Vendor Question">Vendor Question</option>
                    <option value="Homeowner Support">Homeowner Support</option>
                    <option value="Technical Issue">Technical Issue</option>
                    <option value="Billing Question">Billing Question</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-foreground resize-none"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>
          </div>
        </section>

        {/* Other Contact Info */}
        <section className="border-t border-border/40 py-20 md:py-24">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div className="space-y-3">
                  <div className="text-4xl">📧</div>
                  <h3 className="text-lg font-semibold">Email</h3>
                  <p className="text-muted-foreground">
                    support@nantucketpros.com
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="text-4xl">💬</div>
                  <h3 className="text-lg font-semibold">Support Hours</h3>
                  <p className="text-muted-foreground">
                    Monday - Friday<br />9am - 5pm EST
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="text-4xl">📍</div>
                  <h3 className="text-lg font-semibold">Location</h3>
                  <p className="text-muted-foreground">
                    Nantucket, MA
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Link */}
        <section className="border-t border-border/40 py-20 md:py-24 bg-muted/20">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Looking for Quick Answers?
              </h2>
              <p className="text-lg text-muted-foreground">
                Check out our Help Center for frequently asked questions and guides.
              </p>
              <div className="pt-4">
                <Link href="/faq">
                  <Button size="lg" variant="outline">
                    Visit Help Center
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
