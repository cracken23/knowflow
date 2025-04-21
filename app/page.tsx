'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import Navbar from '@/components/ui/navbar';
import { Github, FileText, Zap, CheckCircle } from 'lucide-react';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:5000';
interface PaperData {
  title?: string;
  abstract?: string;
  conclusion?: string;
  references?: string;
}
export default function Home() {
  const [githubUrl, setGithubUrl] = useState('');
  const [documentation, setDocumentation] = useState('');
  const [paperData] = useState<PaperData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = githubUrl ? '/api/generate_from_github' : '/api/generate_paper';
      const body = githubUrl 
        ? { repo_url: githubUrl }
        : { documentation };
      const res = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Failed to generate paper');

      const blob = await res.blob();  // :contentReference[oaicite:15]{index=15}

      // Native download approach
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ieee_paper.docx';  // :contentReference[oaicite:16]{index=16}
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      // Or, using FileSaver.js:
      // saveAs(blob, 'ieee_paper.docx'); // :contentReference[oaicite:17]{index=17}

    }catch (err: unknown) {
  let errorMessage = 'Something went wrong';
  if (err instanceof Error) {
    errorMessage = err.message;
  } else if (typeof err === 'string') {
    errorMessage = err;
  }
  setError(errorMessage);
} finally {
  setLoading(false);
}
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
      {/* Navbar */}
      <Navbar />
  
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-600 to-blue-800 pt-24 pb-32">
        <motion.div
          className="absolute inset-0 opacity-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 2 }}
        >
          <Image
            src="/circuit-board.svg"
            alt="Background pattern"
            fill
            className="object-cover"
            quality={100}
          />
        </motion.div>
        <div className="relative mx-auto max-w-6xl px-4 text-center">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl font-bold text-white leading-tight drop-shadow-lg"
          >
            Automated Research Paper Generator
          </motion.h1>
          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-xl text-blue-100 max-w-2xl mx-auto"
          >
            Transform your code documentation into professionally formatted IEEE papers with AI-powered precision.
          </motion.p>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-12"
          >
            <Button
              variant="secondary"
              size="lg"
              className="rounded-full px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-shadow"
              onClick={() => document.getElementById('generate-form')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Zap className="mr-2 h-5 w-5" />
              Get Started Now
            </Button>
          </motion.div>
        </div>
      </section>
  
      {/* Main Content */}
      <main className="flex-1">
        {/* Input Section */}
        <section id="generate-form" className="px-4 py-16 -mt-20">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              className="grid gap-8 md:grid-cols-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              {/* Input Card */}
              <Card className="shadow-2xl border-blue-100 rounded-2xl overflow-hidden">
                <CardHeader className="bg-blue-50 border-b border-blue-100">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-gray-900">
                        Generate Your Paper
                      </CardTitle>
                      <CardDescription className="text-gray-600 mt-1">
                        Start with a GitHub repository or existing documentation
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        GitHub Repository
                      </label>
                      <Input
                        placeholder="https://github.com/username/repo"
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                        className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                      </div>
                      <div className="relative flex justify-center">
                        <span className="px-3 bg-white text-sm text-gray-400 font-medium">
                          OR
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Direct Documentation
                      </label>
                      <Textarea
                        placeholder="Paste your documentation here..."
                        value={documentation}
                        onChange={(e) => setDocumentation(e.target.value)}
                        className="h-40 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <Button
                    size="lg"
                    className="w-full py-6 text-lg font-semibold rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-colors shadow-lg"
                    onClick={handleSubmit}
                    disabled={loading || (!githubUrl && !documentation)}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                        Generating...
                      </div>
                    ) : (
                      <>
                        <FileText className="mr-2 h-5 w-5" />
                        Generate IEEE Paper
                      </>
                    )}
                  </Button>

                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-3">
                      <span className="text-red-600">⚠</span>
                      <span className="font-medium">{error}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Features Card */}
              <Card className="shadow-2xl border-gray-100 rounded-2xl overflow-hidden">
                <CardHeader className="bg-gray-50 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-gray-700" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-gray-900">
                        Why Choose Us?
                      </CardTitle>
                      <CardDescription className="text-gray-600 mt-1">
                        The smartest way to create research papers
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Zap className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Instant Generation</h3>
                        <p className="text-gray-600 mt-1 text-sm">
                          Get your paper ready in minutes with AI-powered automation
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">IEEE Compliance</h3>
                        <p className="text-gray-600 mt-1 text-sm">
                          Strict adherence to official IEEE formatting guidelines
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Github className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">GitHub Integration</h3>
                        <p className="text-gray-600 mt-1 text-sm">
                          Directly analyze codebases from any public repository
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Smart Formatting</h3>
                        <p className="text-gray-600 mt-1 text-sm">
                          Automatic structuring with proper sections and citations
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Preview Section */}
        {paperData && (
          <section className="pb-24">
            <div className="max-w-5xl mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12"
              >
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-900">
                    Your Generated Paper
                  </h2>
                  <p className="text-gray-600 mt-3">
                    Preview of your automatically generated research document
                  </p>
                </div>

                <Card className="shadow-xl rounded-xl border-gray-100">
                  <CardContent className="p-8 space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-gray-900">
                        {paperData.title}
                      </h3>
                      <div className="border-b border-gray-200"></div>
                    </div>

                    <section className="prose prose-blue max-w-none">
                      <h4 className="text-lg font-semibold text-gray-900">Abstract</h4>
                      <p className="text-gray-600 leading-relaxed">
                        {paperData.abstract}
                      </p>
                    </section>

                    {paperData.conclusion && (
                      <section className="prose prose-blue max-w-none">
                        <h4 className="text-lg font-semibold text-gray-900">Conclusion</h4>
                        <p className="text-gray-600 leading-relaxed">
                          {paperData.conclusion}
                        </p>
                      </section>
                    )}

                    {paperData.references && (
                      <section className="prose prose-blue max-w-none">
                        <h4 className="text-lg font-semibold text-gray-900">References</h4>
                        <div className="text-gray-600 space-y-2">
                          {paperData.references}
                        </div>
                      </section>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </section>
        )}
      </main>
  
      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            © {new Date().getFullYear()} KnowFlow. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
