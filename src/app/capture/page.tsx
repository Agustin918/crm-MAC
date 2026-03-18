'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowRight, CheckCircle2, Zap, Shield, Clock, 
  Home, Ruler, Mail, Phone, FileText, Building2
} from 'lucide-react';

export default function CapturePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    meters: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          meters: parseFloat(formData.meters) || null,
          source: 'instagram'
        })
      });

      if (res.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          router.push('/contacts');
        }, 2500);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const inputVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4 }
    })
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full max-w-md text-center p-10 shadow-2xl">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mb-6"
            >
              <CheckCircle2 className="h-12 w-12 text-white" />
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-3xl font-bold text-slate-800 mb-2"
            >
              ¡Consulta enviada!
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-slate-600 mb-4"
            >
              Gracias {formData.name}. Te contactaremos en breve.
            </motion.p>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-sm text-slate-400"
            >
              Redirecting...
            </motion.p>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 md:p-8">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg relative z-10"
      >
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-4 shadow-lg shadow-indigo-500/25">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
            A7
          </h1>
          <p className="text-slate-400 text-lg">
            Arquitectura & Diseño
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto mt-4 rounded-full"></div>
        </motion.div>

        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-bold text-center">
              Cuéntanos sobre tu proyecto
            </CardTitle>
            <CardDescription className="text-center">
              Completa el formulario y te contactamos en menos de 24hs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <motion.div
                custom={0}
                initial="hidden"
                animate="visible"
                variants={inputVariants}
              >
                <Label htmlFor="name" className="text-gray-200 font-medium">
                  Nombre completo *
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="name"
                    placeholder="Juan Pérez"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="h-12 pl-10 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Home className="h-4 w-4" />
                  </div>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div
                  custom={1}
                  initial="hidden"
                  animate="visible"
                  variants={inputVariants}
                >
                  <Label htmlFor="email" className="text-gray-200 font-medium">
                    Email *
                  </Label>
                  <div className="relative mt-1.5">
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="h-12 pl-10 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Mail className="h-4 w-4" />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  custom={2}
                  initial="hidden"
                  animate="visible"
                  variants={inputVariants}
                >
                  <Label htmlFor="phone" className="text-gray-200 font-medium">
                    Teléfono *
                  </Label>
                  <div className="relative mt-1.5">
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+54 9 11..."
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      className="h-12 pl-10 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Phone className="h-4 w-4" />
                    </div>
                  </div>
                </motion.div>
              </div>

              <motion.div
                custom={3}
                initial="hidden"
                animate="visible"
                variants={inputVariants}
              >
                <Label htmlFor="meters" className="text-gray-200 font-medium">
                  Metros cuadrados *
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="meters"
                    type="number"
                    placeholder="150"
                    value={formData.meters}
                    onChange={(e) => setFormData({ ...formData, meters: e.target.value })}
                    required
                    className="h-12 pl-10 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Ruler className="h-4 w-4" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                custom={4}
                initial="hidden"
                animate="visible"
                variants={inputVariants}
              >
                <Label htmlFor="description" className="text-gray-200 font-medium">
                  Descripción del proyecto *
                </Label>
                <div className="relative mt-1.5">
                  <Textarea
                    id="description"
                    placeholder="¿Qué tipo de vivienda buscás? ¿En qué zona? ¿Tenés algún estilo preferido?"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    className="min-h-[120px] pl-10 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-indigo-500 focus:ring-indigo-500 resize-none"
                  />
                  <div className="absolute left-3 top-4 text-gray-400">
                    <FileText className="h-4 w-4" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                custom={5}
                initial="hidden"
                animate="visible"
                variants={inputVariants}
              >
                <Button 
                  type="submit" 
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
                      Enviando...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Enviar consulta
                      <ArrowRight className="h-5 w-5" />
                    </span>
                  )}
                </Button>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex items-center justify-center gap-6 pt-2"
              >
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Zap className="h-3.5 w-3.5 text-amber-500" />
                  <span>Rápido</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Shield className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Seguro</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Clock className="h-3.5 w-3.5 text-blue-500" />
                  <span>24/7</span>
                </div>
              </motion.div>
            </form>
          </CardContent>
        </Card>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-gray-500 text-sm mt-6"
        >
          © 2024 A7 Arquitectura. Todos los derechos reservados.
        </motion.p>
      </motion.div>
    </div>
  );
}
