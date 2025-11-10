import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Terms of Service
              </h1>
              <p className="text-lg text-muted-foreground">
                Last Updated: November 9, 2025
              </p>
              <div className="pt-4 px-6 py-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
                <p className="text-sm font-semibold text-yellow-900">
                  IMPORTANT LEGAL NOTICE: Please read these Terms carefully. By using NantucketPros, you agree to these Terms and acknowledge that we are a marketplace platform only and assume no liability for services provided.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Terms Content */}
        <section className="border-t border-border/40 py-16 md:py-20 bg-muted/20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto space-y-12">

              {/* Section 1 */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">1. ACCEPTANCE OF TERMS</h2>
                <p className="text-muted-foreground leading-relaxed">
                  By creating an account, accessing, or using NantucketPros.com (the &quot;Platform&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, do not use the Platform.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  NantucketPros operates solely as a marketplace platform connecting homeowners with service providers. <strong>WE ARE NOT A SERVICE PROVIDER AND DO NOT EMPLOY, RECOMMEND, ENDORSE, OR ASSUME ANY RESPONSIBILITY FOR ANY SERVICE PROVIDER OR THE SERVICES THEY PROVIDE.</strong>
                </p>
              </div>

              {/* Section 2 */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">2. DEFINITIONS</h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li><strong>&quot;Platform&quot;</strong> refers to NantucketPros.com and all related services</li>
                  <li><strong>&quot;Homeowner&quot;</strong> refers to any user seeking services through the Platform</li>
                  <li><strong>&quot;Service Provider&quot;</strong> or <strong>&quot;Business Owner&quot;</strong> refers to any individual or business offering services through the Platform</li>
                  <li><strong>&quot;Services&quot;</strong> refers to any work, labor, or services arranged through the Platform</li>
                  <li><strong>&quot;We,&quot; &quot;Us,&quot; &quot;Our&quot;</strong> refers to NantucketPros and its operators</li>
                </ul>
              </div>

              {/* Section 3 */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">3. NATURE OF PLATFORM</h2>
                <h3 className="text-xl font-semibold mt-4">3.1 Marketplace Only</h3>
                <p className="text-muted-foreground leading-relaxed">
                  NantucketPros is a technology platform that facilitates connections between Homeowners and Service Providers. We:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>DO NOT provide home services</li>
                  <li>DO NOT employ or control Service Providers</li>
                  <li>DO NOT supervise, direct, or control Services performed</li>
                  <li>DO NOT verify qualifications, licenses, insurance, or background of Service Providers beyond basic account verification</li>
                  <li>DO NOT guarantee the quality, safety, legality, or timing of any Services</li>
                  <li>ARE NOT responsible for the actions, conduct, or omissions of any user</li>
                </ul>

                <h3 className="text-xl font-semibold mt-4">3.2 Independent Contractors</h3>
                <p className="text-muted-foreground leading-relaxed">
                  All Service Providers are independent contractors. No employment, agency, partnership, joint venture, or franchise relationship exists between NantucketPros and any Service Provider or Homeowner.
                </p>
              </div>

              {/* Section 4 */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">4. HOMEOWNER RESPONSIBILITIES AND AGREEMENTS</h2>
                <h3 className="text-xl font-semibold mt-4">4.1 Homeowner Obligations</h3>
                <p className="text-muted-foreground leading-relaxed">
                  As a Homeowner, you acknowledge and agree that:
                </p>

                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-foreground">1. Due Diligence:</p>
                    <p className="text-muted-foreground leading-relaxed">You are solely responsible for:</p>
                    <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                      <li>Evaluating Service Providers before booking</li>
                      <li>Verifying licenses, insurance, qualifications, and references</li>
                      <li>Ensuring Service Providers are qualified for the work</li>
                      <li>Confirming compliance with local laws and regulations</li>
                      <li>Obtaining necessary permits for work performed</li>
                    </ul>
                  </div>

                  <div>
                    <p className="font-semibold text-foreground">2. Direct Relationship:</p>
                    <p className="text-muted-foreground leading-relaxed">Any contract for Services is directly between you and the Service Provider. NantucketPros is not a party to this agreement.</p>
                  </div>

                  <div>
                    <p className="font-semibold text-foreground">3. Property Access:</p>
                    <p className="text-muted-foreground leading-relaxed">You are responsible for:</p>
                    <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                      <li>Securing your property and belongings</li>
                      <li>Providing safe working conditions</li>
                      <li>Supervising work as you deem necessary</li>
                      <li>Any damage or loss occurring on your property</li>
                    </ul>
                  </div>

                  <div>
                    <p className="font-semibold text-foreground">4. Payment:</p>
                    <p className="text-muted-foreground leading-relaxed">You agree to:</p>
                    <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                      <li>Pay for Services as agreed with the Service Provider</li>
                      <li>Resolve all payment disputes directly with the Service Provider</li>
                      <li>Be responsible for any chargebacks, fees, or penalties</li>
                    </ul>
                  </div>
                </div>

                <h3 className="text-xl font-semibold mt-6">4.2 Homeowner Assumption of Risk</h3>
                <p className="text-muted-foreground leading-relaxed">
                  You expressly assume all risks associated with:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>Quality and completion of Services</li>
                  <li>Damage to property or belongings</li>
                  <li>Personal injury or death</li>
                  <li>Non-compliance with building codes or regulations</li>
                  <li>Defective or incomplete work</li>
                  <li>Any disputes with Service Providers</li>
                </ul>
              </div>

              {/* Section 5 */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">5. SERVICE PROVIDER RESPONSIBILITIES AND AGREEMENTS</h2>
                <h3 className="text-xl font-semibold mt-4">5.1 Service Provider Obligations</h3>
                <p className="text-muted-foreground leading-relaxed">
                  As a Service Provider, you acknowledge and agree that:
                </p>

                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-foreground">1. Professional Qualifications:</p>
                    <p className="text-muted-foreground leading-relaxed">You represent and warrant that you:</p>
                    <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                      <li>Hold all necessary licenses, permits, and certifications required by law</li>
                      <li>Maintain adequate liability and workers&apos; compensation insurance</li>
                      <li>Comply with all applicable federal, state, and local laws and regulations</li>
                      <li>Have the skills, equipment, and experience to perform Services safely and competently</li>
                      <li>Are financially and legally responsible for all work performed</li>
                    </ul>
                  </div>

                  <div>
                    <p className="font-semibold text-foreground">2. Independent Operation:</p>
                    <p className="text-muted-foreground leading-relaxed">You are an independent contractor and are solely responsible for:</p>
                    <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                      <li>How, when, and where Services are performed</li>
                      <li>All tools, equipment, materials, and labor</li>
                      <li>All taxes, insurance, and business expenses</li>
                      <li>Hiring and supervising any employees or subcontractors</li>
                      <li>Compliance with employment laws and regulations</li>
                    </ul>
                  </div>

                  <div>
                    <p className="font-semibold text-foreground">3. Customer Relations:</p>
                    <p className="text-muted-foreground leading-relaxed">You are solely responsible for:</p>
                    <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                      <li>All communications with Homeowners</li>
                      <li>Scheduling and performing Services</li>
                      <li>Quality and safety of all work</li>
                      <li>Resolving disputes and complaints</li>
                      <li>Honoring warranties or guarantees you provide</li>
                    </ul>
                  </div>
                </div>

                <h3 className="text-xl font-semibold mt-6">5.2 Service Provider Assumption of Risk</h3>
                <p className="text-muted-foreground leading-relaxed">
                  You expressly assume all risks associated with:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>Performance of Services</li>
                  <li>Property damage or personal injury claims</li>
                  <li>Professional liability and errors or omissions</li>
                  <li>Employee or subcontractor issues</li>
                  <li>Equipment failure or accidents</li>
                  <li>Payment disputes with Homeowners</li>
                </ul>
              </div>

              {/* Section 6 */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">6. MUTUAL USER RESPONSIBILITIES</h2>
                <h3 className="text-xl font-semibold mt-4">6.1 Account Security</h3>
                <p className="text-muted-foreground leading-relaxed">You are responsible for:</p>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>Maintaining confidentiality of your account credentials</li>
                  <li>All activity occurring under your account</li>
                  <li>Notifying us immediately of unauthorized access</li>
                </ul>

                <h3 className="text-xl font-semibold mt-4">6.2 Prohibited Conduct</h3>
                <p className="text-muted-foreground leading-relaxed">You may not:</p>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>Provide false, misleading, or inaccurate information</li>
                  <li>Impersonate any person or entity</li>
                  <li>Engage in fraudulent, illegal, or harmful activities</li>
                  <li>Harass, threaten, or harm other users</li>
                  <li>Attempt to circumvent Platform fees by conducting transactions off-platform</li>
                  <li>Scrape, copy, or misuse Platform content or data</li>
                  <li>Violate any applicable laws or regulations</li>
                </ul>
              </div>

              {/* Section 7 */}
              <div className="space-y-4 bg-red-50 border-2 border-red-300 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-red-900">7. DISCLAIMER OF WARRANTIES</h2>
                <p className="font-semibold text-red-900">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE PLATFORM IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-red-900">
                  <li><strong>NO WARRANTY OF SERVICE QUALITY:</strong> We make no representations about the quality, safety, legality, or reliability of any Services or Service Providers</li>
                  <li><strong>NO WARRANTY OF AVAILABILITY:</strong> We do not guarantee the Platform will be uninterrupted, secure, or error-free</li>
                  <li><strong>NO WARRANTY OF ACCURACY:</strong> We do not warrant that information on the Platform is accurate, complete, or current</li>
                  <li><strong>NO WARRANTY OF FITNESS:</strong> We disclaim all implied warranties of merchantability, fitness for a particular purpose, and non-infringement</li>
                </ul>
              </div>

              {/* Section 8 */}
              <div className="space-y-4 bg-red-50 border-2 border-red-300 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-red-900">8. LIMITATION OF LIABILITY</h2>

                <h3 className="text-xl font-semibold text-red-900 mt-4">8.1 No Liability for Services</h3>
                <p className="font-semibold text-red-900">
                  NANTUCKETPROS SHALL NOT BE LIABLE FOR ANY DAMAGES, LOSSES, OR CLAIMS ARISING FROM OR RELATED TO:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-red-900">
                  <li>Services performed or not performed by Service Providers</li>
                  <li>Quality, safety, legality, or timeliness of Services</li>
                  <li>Actions, omissions, or conduct of any user</li>
                  <li>Property damage, personal injury, or death</li>
                  <li>Defective work, incomplete projects, or code violations</li>
                  <li>Payment disputes between users</li>
                  <li>Breach of contract by Service Providers or Homeowners</li>
                  <li>Loss of data, profits, or business opportunities</li>
                </ul>

                <h3 className="text-xl font-semibold text-red-900 mt-6">8.2 Maximum Liability Cap</h3>
                <p className="font-semibold text-red-900">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, OUR TOTAL LIABILITY TO YOU FOR ANY CLAIMS ARISING FROM THESE TERMS OR USE OF THE PLATFORM SHALL NOT EXCEED THE AMOUNT YOU PAID TO US IN PLATFORM FEES IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM, OR ONE HUNDRED DOLLARS ($100), WHICHEVER IS LESS.
                </p>

                <h3 className="text-xl font-semibold text-red-900 mt-6">8.3 Exclusion of Damages</h3>
                <p className="font-semibold text-red-900">
                  WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY DAMAGES, INCLUDING BUT NOT LIMITED TO:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-red-900">
                  <li>Loss of profits, revenue, or business</li>
                  <li>Loss of data or information</li>
                  <li>Cost of substitute services</li>
                  <li>Property damage or personal injury</li>
                  <li>Emotional distress or reputational harm</li>
                </ul>
                <p className="font-semibold text-red-900 mt-4">
                  THIS LIMITATION APPLIES EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES AND REGARDLESS OF THE THEORY OF LIABILITY (CONTRACT, TORT, NEGLIGENCE, STRICT LIABILITY, OR OTHERWISE).
                </p>
              </div>

              {/* Section 9 */}
              <div className="space-y-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-yellow-900">9. INDEMNIFICATION</h2>

                <h3 className="text-xl font-semibold text-yellow-900 mt-4">9.1 Homeowner Indemnification</h3>
                <p className="text-yellow-900 leading-relaxed">
                  You agree to indemnify, defend, and hold harmless NantucketPros, its officers, directors, employees, agents, and affiliates from and against any and all claims, damages, losses, costs, and expenses (including reasonable attorneys&apos; fees) arising from:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-yellow-900">
                  <li>Your use of the Platform</li>
                  <li>Services performed on your property</li>
                  <li>Your breach of these Terms</li>
                  <li>Your violation of any laws or regulations</li>
                  <li>Any disputes with Service Providers</li>
                  <li>Any property damage or personal injury occurring on your property</li>
                </ul>

                <h3 className="text-xl font-semibold text-yellow-900 mt-6">9.2 Service Provider Indemnification</h3>
                <p className="text-yellow-900 leading-relaxed">
                  You agree to indemnify, defend, and hold harmless NantucketPros, its officers, directors, employees, agents, and affiliates from and against any and all claims, damages, losses, costs, and expenses (including reasonable attorneys&apos; fees) arising from:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-yellow-900">
                  <li>Services you perform or fail to perform</li>
                  <li>Your breach of these Terms</li>
                  <li>Your violation of any laws, regulations, or professional standards</li>
                  <li>Any property damage or personal injury caused by your Services</li>
                  <li>Claims by your employees, subcontractors, or clients</li>
                  <li>Your failure to maintain proper licenses, permits, or insurance</li>
                  <li>Any defective, incomplete, or non-compliant work</li>
                  <li>Any disputes with Homeowners or third parties</li>
                </ul>
              </div>

              {/* Section 10 */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">10. DISPUTE RESOLUTION</h2>

                <h3 className="text-xl font-semibold mt-4">10.1 User Disputes</h3>
                <p className="font-semibold text-foreground">
                  All disputes between Homeowners and Service Providers must be resolved directly between the parties. NantucketPros has no obligation to mediate, resolve, or become involved in any user disputes.
                </p>

                <h3 className="text-xl font-semibold mt-4">10.2 Mandatory Arbitration</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Any dispute between you and NantucketPros arising from these Terms or use of the Platform shall be resolved by binding arbitration in accordance with the rules of the American Arbitration Association. You waive any right to a jury trial or to participate in a class action lawsuit.
                </p>

                <h3 className="text-xl font-semibold mt-4">10.3 Governing Law</h3>
                <p className="text-muted-foreground leading-relaxed">
                  These Terms shall be governed by the laws of the Commonwealth of Massachusetts, without regard to conflict of law principles.
                </p>

                <h3 className="text-xl font-semibold mt-4">10.4 Venue</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Any arbitration or legal proceedings shall take place in Nantucket County, Massachusetts.
                </p>
              </div>

              {/* Section 11 */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">11. INSURANCE AND LICENSING</h2>

                <h3 className="text-xl font-semibold mt-4">11.1 Service Provider Requirements</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Service Providers represent and warrant that they maintain:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>General liability insurance with minimum coverage of $1,000,000 per occurrence</li>
                  <li>Workers&apos; compensation insurance as required by law</li>
                  <li>All necessary professional licenses and certifications</li>
                  <li>Any additional insurance required for specific Services</li>
                </ul>
                <p className="font-semibold text-foreground mt-4">
                  NANTUCKETPROS DOES NOT VERIFY INSURANCE OR LICENSES. HOMEOWNERS MUST INDEPENDENTLY VERIFY COVERAGE.
                </p>

                <h3 className="text-xl font-semibold mt-4">11.2 No Insurance Provided</h3>
                <p className="text-muted-foreground leading-relaxed">
                  NantucketPros does not provide insurance coverage for any Services, damages, or injuries. Each party is responsible for obtaining their own insurance.
                </p>
              </div>

              {/* Section 12 */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">12. PAYMENTS AND FEES</h2>

                <h3 className="text-xl font-semibold mt-4">12.1 Platform Fees</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We may charge fees for use of the Platform. All fees are non-refundable unless otherwise specified in writing.
                </p>

                <h3 className="text-xl font-semibold mt-4">12.2 Payment Processing</h3>
                <p className="text-muted-foreground leading-relaxed">
                  If we process payments on behalf of Service Providers:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>We act only as a payment facilitator</li>
                  <li>We do not guarantee payment collection or delivery</li>
                  <li>We are not liable for payment processing errors, delays, or failures</li>
                  <li>Chargebacks and disputes are handled according to payment processor policies</li>
                </ul>

                <h3 className="text-xl font-semibold mt-4">12.3 Taxes</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Each party is responsible for all taxes associated with their use of the Platform and any transactions conducted through it.
                </p>
              </div>

              {/* Section 13 */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">13. INTELLECTUAL PROPERTY</h2>
                <p className="text-muted-foreground leading-relaxed">
                  All content on the Platform, including text, graphics, logos, and software, is owned by NantucketPros or its licensors and protected by intellectual property laws. You may not copy, reproduce, or misuse Platform content without written permission.
                </p>
              </div>

              {/* Section 14 */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">14. PRIVACY</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Your use of the Platform is subject to our Privacy Policy, which is incorporated into these Terms by reference.
                </p>
              </div>

              {/* Section 15 */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">15. MODIFICATIONS TO TERMS</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting to the Platform. Your continued use of the Platform after changes constitutes acceptance of the modified Terms.
                </p>
              </div>

              {/* Section 16 */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">16. TERMINATION</h2>

                <h3 className="text-xl font-semibold mt-4">16.1 Our Right to Terminate</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We may suspend or terminate your account at any time, with or without cause, with or without notice. We have no liability for any termination.
                </p>

                <h3 className="text-xl font-semibold mt-4">16.2 Your Right to Terminate</h3>
                <p className="text-muted-foreground leading-relaxed">
                  You may terminate your account at any time by contacting us. Termination does not relieve you of obligations incurred before termination.
                </p>

                <h3 className="text-xl font-semibold mt-4">16.3 Effect of Termination</h3>
                <p className="text-muted-foreground leading-relaxed">Upon termination:</p>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>Your right to use the Platform immediately ceases</li>
                  <li>You remain liable for all obligations and liabilities incurred</li>
                  <li>Sections 7-11 and 13-19 survive termination</li>
                </ul>
              </div>

              {/* Section 17 */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">17. ENTIRE AGREEMENT</h2>
                <p className="text-muted-foreground leading-relaxed">
                  These Terms constitute the entire agreement between you and NantucketPros and supersede all prior agreements, understandings, and communications.
                </p>
              </div>

              {/* Section 18 */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">18. SEVERABILITY</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.
                </p>
              </div>

              {/* Section 19 */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">19. NO WAIVER</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Our failure to enforce any right or provision of these Terms shall not constitute a waiver of such right or provision.
                </p>
              </div>

              {/* Section 20 */}
              <div className="space-y-4 bg-blue-50 border-2 border-blue-300 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-blue-900">20. ACKNOWLEDGMENT AND ACCEPTANCE</h2>
                <p className="font-semibold text-blue-900">
                  BY CREATING AN ACCOUNT OR USING THE PLATFORM, YOU ACKNOWLEDGE THAT:
                </p>
                <ol className="list-decimal pl-6 space-y-2 text-blue-900">
                  <li>You have read and understand these Terms</li>
                  <li>You agree to be bound by these Terms</li>
                  <li>You understand that NantucketPros is a marketplace platform only</li>
                  <li>You assume all risks associated with Services booked through the Platform</li>
                  <li>You release NantucketPros from all liability related to Services, user conduct, and transactions</li>
                  <li>You are solely responsible for evaluating Service Providers and ensuring proper licenses, insurance, and qualifications</li>
                  <li>You will resolve all disputes directly with other users without involving NantucketPros</li>
                  <li>You waive any claims against NantucketPros for damages, losses, or injuries</li>
                </ol>
              </div>

              {/* Section 21 */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">21. CONTACT INFORMATION</h2>
                <p className="text-muted-foreground leading-relaxed">
                  For questions about these Terms, contact:
                </p>
                <div className="text-muted-foreground">
                  <p className="font-semibold">NantucketPros</p>
                  <p>owenhudsondesign@gmail.com</p>
                  <p>(508) 221-2384</p>
                </div>
              </div>

              {/* Final Notice */}
              <div className="bg-gray-100 border-2 border-gray-400 rounded-lg p-6 mt-8">
                <p className="text-sm text-gray-700 italic text-center">
                  This is a legal document. If you do not understand any provision, consult with an attorney before accepting.
                </p>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
