"use client";

import { useState } from "react";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type FAQCategory = "general" | "homeowners" | "vendors" | "payments" | "safety";

interface FAQItem {
  question: string;
  answer: string;
  category: FAQCategory;
}

const faqs: FAQItem[] = [
  // General
  {
    question: "What is NantucketPros?",
    answer: "NantucketPros is a trusted marketplace connecting homeowners and property caretakers with verified service professionals on Nantucket Island. We handle everything from quotes to payments, making it easy to find and hire quality vendors.",
    category: "general",
  },
  {
    question: "How do I get started?",
    answer: "Simply create an account by clicking the 'Get Started' button. Choose whether you're a homeowner looking for services or a vendor offering services. Homeowners can start browsing vendors immediately, while vendors will need to complete a verification process.",
    category: "general",
  },
  {
    question: "Is NantucketPros free to use?",
    answer: "For homeowners, browsing and booking services is completely free. Vendors pay a 5% commission only on completed jobs - no monthly fees or upfront costs.",
    category: "general",
  },
  {
    question: "What types of services are available?",
    answer: "We offer a wide range of services including landscaping, plumbing, electrical, construction, cleaning, HVAC, painting, carpentry, property maintenance, and more. Browse our vendor directory to see all available services.",
    category: "general",
  },

  // Homeowners
  {
    question: "How do I book a service?",
    answer: "Browse our vendor directory, select a vendor, and request a quote by describing your project. The vendor will respond with a detailed proposal. Once you accept, you can securely pay through our platform and the vendor will schedule the work.",
    category: "homeowners",
  },
  {
    question: "Are all vendors verified?",
    answer: "Yes! Every vendor on our platform goes through a rigorous verification process including license verification, insurance validation, background checks, and business verification. We only work with licensed and insured professionals.",
    category: "homeowners",
  },
  {
    question: "What if I'm not satisfied with the work?",
    answer: "Your payment is held in escrow until you approve the completed work. If there are issues, you can communicate with the vendor to resolve them. If you can't reach a resolution, contact our support team and we'll help mediate the dispute.",
    category: "homeowners",
  },
  {
    question: "Can I message vendors before booking?",
    answer: "Absolutely! You can message any vendor to ask questions, discuss your project, and get quotes before making any commitments. All communication happens through our secure messaging system.",
    category: "homeowners",
  },
  {
    question: "How do reviews work?",
    answer: "After a job is completed, you can leave a review rating the vendor's professionalism, quality of work, and timeliness. Only verified customers who have completed bookings can leave reviews, ensuring authenticity.",
    category: "homeowners",
  },

  // Vendors
  {
    question: "How do I become a vendor on NantucketPros?",
    answer: "Sign up as a vendor, complete your business profile, and submit your license, insurance, and business documents. Our team will review your application within 48 hours. Once approved, your profile goes live and you can start receiving quote requests.",
    category: "vendors",
  },
  {
    question: "What are the vendor requirements?",
    answer: "You must have a valid business license for your trade, general liability insurance (and workers' comp if applicable), pass a background check, and maintain high-quality work standards with positive customer reviews.",
    category: "vendors",
  },
  {
    question: "How much does it cost to be a vendor?",
    answer: "There are no setup fees or monthly subscriptions. We charge a simple 5% commission on completed jobs only. You only pay when you get paid.",
    category: "vendors",
  },
  {
    question: "How do I receive leads?",
    answer: "When a homeowner searches for your type of service, your profile appears in the results. Homeowners can message you directly or request quotes. You'll receive email notifications for all new inquiries.",
    category: "vendors",
  },
  {
    question: "When do I get paid?",
    answer: "Once you complete a job and the homeowner approves it, payment is released to your account within 2-3 business days. Our 5% commission is automatically deducted before payout.",
    category: "vendors",
  },
  {
    question: "Can I set my own prices?",
    answer: "Yes! You have complete control over your pricing. You can set hourly rates, flat fees, or provide custom quotes for each project. There's no price fixing - you decide what your services are worth.",
    category: "vendors",
  },

  // Payments
  {
    question: "How does payment work?",
    answer: "All payments are processed securely through Stripe. When a homeowner books a service, their payment is held in escrow. Once the work is completed and approved, the funds are released to the vendor within 2-3 business days.",
    category: "payments",
  },
  {
    question: "What payment methods are accepted?",
    answer: "We accept all major credit cards (Visa, Mastercard, American Express, Discover) and debit cards through our secure Stripe payment processor. Bank transfers may be available for larger projects.",
    category: "payments",
  },
  {
    question: "Are there any additional fees?",
    answer: "For homeowners, there are no additional fees beyond the quoted service price. Vendors pay a 5% commission on completed jobs. Standard payment processing fees are included in this commission.",
    category: "payments",
  },
  {
    question: "How do refunds work?",
    answer: "If work is not completed or there's a significant issue, you can request a refund through our dispute resolution process. Our team will review the case and mediate a fair resolution between the homeowner and vendor.",
    category: "payments",
  },
  {
    question: "Is my payment information secure?",
    answer: "Absolutely. All payment information is processed through Stripe, a PCI-compliant payment processor trusted by millions of businesses worldwide. We never store your credit card information on our servers.",
    category: "payments",
  },

  // Safety & Trust
  {
    question: "How do you verify vendors?",
    answer: "We verify business licenses, validate insurance coverage, conduct background screenings, and confirm business registration. We also monitor vendor performance and customer reviews to maintain quality standards.",
    category: "safety",
  },
  {
    question: "What if there's a dispute?",
    answer: "Our support team is here to help. Contact us immediately if there's an issue with a booking. We'll work with both parties to reach a fair resolution. Payment is held in escrow until disputes are resolved.",
    category: "safety",
  },
  {
    question: "Is my personal information protected?",
    answer: "Yes. We use industry-standard encryption and security measures to protect your data. Your contact information is only shared with vendors when you initiate a booking. We never sell your information to third parties.",
    category: "safety",
  },
  {
    question: "Can I report a vendor?",
    answer: "If you experience unprofessional behavior or have safety concerns, please report it to our support team immediately. We take all reports seriously and will investigate. Vendors who violate our standards are removed from the platform.",
    category: "safety",
  },
];

const categories: { id: FAQCategory; label: string; icon: string }[] = [
  { id: "general", label: "General", icon: "❓" },
  { id: "homeowners", label: "For Homeowners", icon: "🏠" },
  { id: "vendors", label: "For Vendors", icon: "🔨" },
  { id: "payments", label: "Payments", icon: "💳" },
  { id: "safety", label: "Trust & Safety", icon: "🔒" },
];

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState<FAQCategory | "all">("all");
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);

  const filteredFAQs = selectedCategory === "all"
    ? faqs
    : faqs.filter(faq => faq.category === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Help Center
              </h1>
              <p className="text-xl text-muted-foreground">
                Find answers to common questions about NantucketPros
              </p>
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="border-t border-border/40 py-12 bg-muted/20">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    selectedCategory === "all"
                      ? "bg-foreground text-background"
                      : "bg-background border border-border hover:border-foreground"
                  }`}
                >
                  All Questions
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                      selectedCategory === cat.id
                        ? "bg-foreground text-background"
                        : "bg-background border border-border hover:border-foreground"
                    }`}
                  >
                    <span className="mr-2">{cat.icon}</span>
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ List */}
        <section className="py-20 md:py-24">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto space-y-4">
              {filteredFAQs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white border border-border/40 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => setOpenQuestion(openQuestion === index ? null : index)}
                    className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-muted/20 transition-colors"
                  >
                    <span className="font-semibold text-lg pr-4">{faq.question}</span>
                    <span className="text-2xl flex-shrink-0">
                      {openQuestion === index ? "−" : "+"}
                    </span>
                  </button>
                  {openQuestion === index && (
                    <div className="px-6 pb-4 text-muted-foreground">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Still Have Questions */}
        <section className="border-t border-border/40 py-20 md:py-24 bg-muted/20">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Still Have Questions?
              </h2>
              <p className="text-lg text-muted-foreground">
                Can't find what you're looking for? Our support team is here to help.
              </p>
              <div className="pt-4">
                <Link href="/contact">
                  <Button size="lg">Contact Support</Button>
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
