import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, 
  Mic, 
  Database, 
  BarChart3, 
  Users, 
  Palette,
  CheckCircle,
  Star,
  ArrowRight,
  PlayCircle,
  Zap,
  Shield,
  Globe,
  Clock,
  Calendar
} from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function LandingPage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const features = [
    {
      icon: <Phone className="h-8 w-8 text-blue-600" />,
      title: "Smart AI Agent",
      description: "Intelligent voice agents that understand context and handle complex customer queries with human-like conversation."
    },
    {
      icon: <Mic className="h-8 w-8 text-green-600" />,
      title: "Natural Voice Recognition",
      description: "Advanced speech-to-text and text-to-speech technology with support for multiple languages and accents."
    },
    {
      icon: <Database className="h-8 w-8 text-purple-600" />,
      title: "Easy CRM Integration",
      description: "Seamlessly connects with your existing CRM systems including Salesforce, HubSpot, and custom APIs."
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-orange-600" />,
      title: "Call Recording & Analytics",
      description: "Comprehensive analytics and insights on customer interactions with detailed reporting and sentiment analysis."
    },
    {
      icon: <Users className="h-8 w-8 text-teal-600" />,
      title: "Multi-Tenant Architecture",
      description: "Scalable infrastructure supporting thousands of businesses with complete data isolation and security."
    },
    {
      icon: <Palette className="h-8 w-8 text-pink-600" />,
      title: "Full White Label Support",
      description: "Complete customization with your branding, domain, and voice personality to match your business."
    }
  ];

  const testimonials = [
    {
      company: "TechFlow Solutions",
      logo: "🏢",
      quote: "CustomerCare Pro reduced our call handling time by 60% while improving customer satisfaction scores.",
      author: "Sarah Johnson",
      role: "Head of Customer Success",
      rating: 5
    },
    {
      company: "Global Retail Corp",
      logo: "🛒",
      quote: "The AI agents handle 80% of our customer queries autonomously. It's like having a 24/7 support team.",
      author: "Mike Chen",
      role: "CTO",
      rating: 5
    },
    {
      company: "FinTech Innovations",
      logo: "💰",
      quote: "Seamless integration with our existing systems. The multi-tenant architecture scales perfectly.",
      author: "Lisa Rodriguez",
      role: "VP of Operations",
      rating: 5
    }
  ];

  const pricingTiers = [
    {
      name: "Starter",
      price: "$99",
      period: "/month",
      description: "Perfect for small businesses",
      features: [
        "1 AI Voice Agent",
        "500 minutes/month",
        "Basic analytics",
        "Email support",
        "CRM integration"
      ],
      popular: false
    },
    {
      name: "Professional",
      price: "$299",
      period: "/month",
      description: "Growing businesses need more",
      features: [
        "5 AI Voice Agents",
        "2,500 minutes/month",
        "Advanced analytics",
        "Priority support",
        "Custom integrations",
        "White label options"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "Unlimited scale and customization",
      features: [
        "Unlimited AI agents",
        "Unlimited minutes",
        "Enterprise analytics",
        "24/7 dedicated support",
        "Custom development",
        "Full white label",
        "SLA guarantees"
      ],
      popular: false
    }
  ];

  const faqs = [
    {
      question: "How quickly can I set up CustomerCare Pro?",
      answer: "Most businesses are up and running within 24 hours. Our onboarding team will help you configure your first AI agent and integrate with your existing systems."
    },
    {
      question: "What languages does the AI support?",
      answer: "We support over 40 languages with natural speech recognition and generation. Our AI can automatically detect the caller's language and respond appropriately."
    },
    {
      question: "How secure is the platform?",
      answer: "We use enterprise-grade security with SOC 2 Type II compliance, end-to-end encryption, and complete data isolation between tenants."
    },
    {
      question: "Can I customize the AI's personality?",
      answer: "Absolutely! You can customize the voice, tone, personality, and even the knowledge base to match your brand and customer service style."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Navigation */}
      <nav className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Phone className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CustomerCare Pro
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors">Features</a>
              <a href="#pricing" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors">Pricing</a>
              <a href="#testimonials" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors">Customers</a>
              <Link href="/auth">
                <Button variant="outline" size="sm">Sign In</Button>
              </Link>
              <Link href="/auth">
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Start Free Trial
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-6 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 border-blue-200 dark:border-blue-800">
            <Zap className="h-3 w-3 mr-1" />
            AI-Powered Customer Support
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
              Revolutionize
            </span>
            <br />
            Customer Support with
            <br />
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              AI Voice Agents
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            Let AI answer, route, and resolve customer calls 24/7. Reduce wait times, 
            increase satisfaction, and scale your support without limits.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/auth">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 text-lg">
                <PlayCircle className="h-5 w-5 mr-2" />
                Start Free Trial
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
              <Calendar className="h-5 w-5 mr-2" />
              Book a Demo
            </Button>
          </div>
          
          {/* Customer Logos */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 items-center opacity-60 max-w-4xl mx-auto">
            {['🏢', '🛒', '💰', '🏥', '🎓', '🏭'].map((logo, i) => (
              <div key={i} className="text-4xl text-center">{logo}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Features for Modern Support</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Everything you need to deliver exceptional customer experiences with AI
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2">
                <CardHeader>
                  <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-16">Trusted by Industry Leaders</h2>
          
          <div className="relative">
            <Card className="p-8 border-0 shadow-xl">
              <div className="flex items-center justify-center mb-6">
                {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <blockquote className="text-2xl font-medium mb-6 text-slate-700 dark:text-slate-300">
                "{testimonials[activeTestimonial].quote}"
              </blockquote>
              
              <div className="flex items-center justify-center space-x-4">
                <div className="text-4xl">{testimonials[activeTestimonial].logo}</div>
                <div className="text-left">
                  <div className="font-semibold">{testimonials[activeTestimonial].author}</div>
                  <div className="text-slate-500 dark:text-slate-400">{testimonials[activeTestimonial].role}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">{testimonials[activeTestimonial].company}</div>
                </div>
              </div>
            </Card>
            
            <div className="flex justify-center space-x-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === activeTestimonial ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Choose the plan that fits your business needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <Card key={index} className={`relative ${tier.popular ? 'ring-2 ring-blue-500 shadow-2xl scale-105' : 'shadow-lg'} border-0`}>
                {tier.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600">
                    Most Popular
                  </Badge>
                )}
                
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <div className="text-4xl font-bold mb-2">
                    {tier.price}
                    <span className="text-lg font-normal text-slate-500 dark:text-slate-400">{tier.period}</span>
                  </div>
                  <CardDescription>{tier.description}</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full ${tier.popular 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
                      : ''}`}
                    variant={tier.popular ? 'default' : 'outline'}
                  >
                    {tier.name === 'Enterprise' ? 'Contact Sales' : 'Start Free Trial'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Everything you need to know about CustomerCare Pro
            </p>
          </div>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Customer Support?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of businesses already using AI to deliver exceptional customer experiences
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg">
                <PlayCircle className="h-5 w-5 mr-2" />
                Start Free Trial
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Phone className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">CustomerCare Pro</span>
              </div>
              <p className="text-slate-400">
                AI-powered voice agents for exceptional customer support.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-700 mt-12 pt-8 text-center text-slate-400">
            <p>&copy; 2024 CustomerCare Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}