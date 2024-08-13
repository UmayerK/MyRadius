import React from 'react';

export default function AboutSection() {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">About Radius</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold text-gray-900 sm:text-4xl">
            A Smarter Approach to Pricing and Efficiency
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            At the heart of Radius is a cutting-edge pricing algorithm designed to adapt to the dynamic needs of our clients and factories. Our approach reflects a commitment to flexibility and scalability, ensuring that prices are optimized based on demand, order size, and regional production factors.
          </p>
        </div>

        <div className="mt-10">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            <div className="relative">
              <dt>
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  {/* Icon (optional) */}
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Demand-Based Pricing</p>
              </dt>
              <dd className="mt-2 ml-16 text-base text-gray-500">
                Our algorithm dynamically adjusts prices based on order quantity, encouraging clients to optimize their purchases and take advantage of economies of scale. As the order size increases, the per-unit cost decreases, maximizing value.
              </dd>
            </div>

            <div className="relative">
              <dt>
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  {/* Icon (optional) */}
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Geo-Specific Pricing</p>
              </dt>
              <dd className="mt-2 ml-16 text-base text-gray-500">
                By factoring in regional production capabilities and economic contexts, our pricing strategy ensures that factories are compensated fairly. This fosters an equitable distribution network that benefits both producers and clients.
              </dd>
            </div>

            <div className="relative">
              <dt>
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  {/* Icon (optional) */}
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">AI-Driven Optimization</p>
              </dt>
              <dd className="mt-2 ml-16 text-base text-gray-500">
                Leveraging AI and machine learning, our platform continuously refines its pricing models. By learning from order histories, production outcomes, and market trends, we enhance our ability to offer competitive, sustainable pricing that satisfies both clients and factories.
              </dd>
            </div>

            <div className="relative">
              <dt>
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  {/* Icon (optional) */}
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Sustainable Value</p>
              </dt>
              <dd className="mt-2 ml-16 text-base text-gray-500">
                Our pricing approach is not just about competition—it's about creating long-term value. By balancing client satisfaction with profitability, we ensure the sustainability of our operations and the continued success of our partners.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}

