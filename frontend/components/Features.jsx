import React from 'react';
import { Star, Truck, Shield, RotateCcw } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Star,
      title: "Best prices & offers",
      description: "Cheaper prices than your local supermarket, great deals and offers"
    },
    {
      icon: Truck,
      title: "Free delivery",
      description: "We deliver with no additional costs"
    },
    {
      icon: Shield,
      title: "Great daily deal",
      description: "When you sign up for our newsletter"
    },
    {
      icon: RotateCcw,
      title: "Easy returns",
      description: "Quick & simple returns"
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid md:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <feature.icon className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-gray-600 text-sm">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
