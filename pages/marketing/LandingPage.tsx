import React from 'react';
import { Link } from 'react-router-dom';
import { BarChartIcon, CheckCircleIcon, CoffeeIcon, ClockIcon, UsersIcon, TrendingUpIcon, ScanLineIcon } from '../../components/icons';

const features = [
  {
    icon: <ScanLineIcon className="h-8 w-8 text-primary-foreground" />,
    title: 'Online Ordering & Payments',
    description: 'Accept orders and payments online with a seamless checkout experience for your customers.',
  },
  {
    icon: <CheckCircleIcon className="h-8 w-8 text-primary-foreground" />,
    title: 'Pickup or Dine-in',
    description: 'Manage both pickup schedules and dine-in reservations easily from one dashboard.',
  },
  {
    icon: <CoffeeIcon className="h-8 w-8 text-primary-foreground" />,
    title: 'Your Own Store Website',
    description: 'Get a beautiful, mobile-friendly website for your store, customized with your branding.',
  },
  {
    icon: <BarChartIcon className="h-8 w-8 text-primary-foreground" />,
    title: 'Sales Reports & Analytics',
    description: 'Track your performance with insightful reports on sales, top products, and customers.',
  },
];

const trialFeatures = [
  {
    icon: <ClockIcon className="h-8 w-8 text-foreground" />,
    title: 'No Credit Card Required',
    description: 'Start your trial instantly with no payment information needed.',
  },
  {
    icon: <UsersIcon className="h-8 w-8 text-foreground" />,
    title: 'Full Feature Access',
    description: 'Explore all premium features during your 7-day trial period.',
  },
  {
    icon: <TrendingUpIcon className="h-8 w-8 text-foreground" />,
    title: 'Cancel Anytime',
    description: 'No obligations - cancel anytime during your trial.',
  },
];

const steps = [
  { number: 1, title: 'Sign Up for Free', description: 'Create your account and store profile in just a few minutes.' },
  { number: 2, title: 'Set Up Your Store', description: 'Add your menu, categories, and business details with our easy-to-use tools.' },
  { number: 3, title: 'Receive Online Orders', description: 'Go live and start accepting orders from your new online storefront!' },
];

const LandingPage = () => {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const heroBgStyle = {
    backgroundImage: `
      linear-gradient(rgba(25, 15, 10, 0.6), rgba(25, 15, 10, 0.6)),
      url("data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHCBYWFRgWFhYZGRgaGhocGhoaHBwaHBocHBocHBoaGhweIS4lHCErIRoYJjgmKy8xNTU1GiQ7QDs0Py40NTEBDAwMEA8QHxISHzQrJCs0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NP/AABEIALcBEwMBIgACEQEDEQH/xAAcAAACAwEBAQEAAAAAAAAAAAAFBgMEBwIBAAj/xABCEAABAwIEAwUECAUDAwUAAwABAgMRAAQFEiExBkFREyJhcYGRoRQyscEHI0JS0fAVUuEWYnKC4vEzQ5KyJFNUY//EABoBAAIDAQEAAAAAAAAAAAAAAAMEAQIFAAb/xAAxEQACAgEDAgMECgMAAAAAAAAAAQIRAwQSITFBBRNRYXGRobHwIoHhFDIjM0LB0VL/2gAMAwEAAhEDEQA/AN4ooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooA-")`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };
  
  const darkSectionBgStyle = {
    backgroundImage: `
      linear-gradient(rgba(30, 20, 15, 0.9), rgba(30, 20, 15, 0.9)),
      url("data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHCBYWFRgWFhUZGRgaHBwaHBwaGxwcHBocHBocHhweHB4cIS4lHB4rIRwaJjgmKy8xNTU1GiQ7QDs0Py40NTEBDAwMEA8QHxISHzYrJCs0NDQ0NDQxNDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NP/AABEIALcBEwMBIgACEQEDEQH/xAAcAAACAwEBAQEAAAAAAAAAAAAFBgMEBwIBAAj/xABHEAABAwIEAwQGBgcGBQUAAAABAgMRAAQFEiExBkFREyJhcYGRoRQyscEHI0JS0fAVFjNicpLh8SQ0U2OCg5OiJVRjorPC/AABBqAQACAwEBAQAAAAAAAAAAAAADBAECBQAG/8QAMREAAgIBAwIDBgYDAAAAAAAAAAECEQMEEiExQQUiUWFxkbHB0fCBoeEUFULxM1Jigv/aAAwDAQACEQMRAD8A1JRRRQAigigigigAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooAooooA-")`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <div className="bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-secondary z-50 shadow-md">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <CoffeeIcon className="h-7 w-7 text-secondary-foreground" />
            <span className="text-2xl font-bold ml-2 text-secondary-foreground">Orderly</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" onClick={(e) => handleNavClick(e, 'features')} className="text-sm font-medium text-secondary-foreground hover:text-white transition-colors">Features</a>
            <a href="#pricing" onClick={(e) => handleNavClick(e, 'pricing')} className="text-sm font-medium text-secondary-foreground hover:text-white transition-colors">Pricing</a>
            <a href="#how-it-works" onClick={(e) => handleNavClick(e, 'how-it-works')} className="text-sm font-medium text-secondary-foreground hover:text-white transition-colors">How it Works</a>
            <div className="w-px h-6 bg-secondary-foreground/20"></div>
            <Link to="/login" className="text-sm font-medium text-secondary-foreground hover:text-white transition-colors">Login</Link>
            <Link to="/signup" className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors text-sm font-medium">Start Free</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section 
        className="pt-40 pb-24 text-center"
        style={heroBgStyle}
      >
        <div className="container mx-auto px-6 relative">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-white text-shadow-lg shadow-black/50">
            The All-in-One Online Ordering System
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white max-w-3xl mx-auto text-shadow shadow-black/50">
            Built for coffee shops, restaurants, and milk tea shops. Launch your online store, manage orders, and grow your business with ease.
          </p>
          <Link to="/signup" className="mt-8 inline-block bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary/90 transition-transform transform hover:scale-105">
            Start Your Free Trial
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-background scroll-mt-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-card p-6 rounded-lg border border-border text-center flex flex-col items-center border-t-4 border-t-primary">
                <div className="bg-primary rounded-full h-16 w-16 flex items-center justify-center mb-5">
                    {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-card-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trial Features Section */}
      <section id="trial-features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Start for Free</h2>
          <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">Try our platform completely free for 7 days</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trialFeatures.map((feature, index) => (
              <div key={index} className="bg-card p-8 rounded-lg border border-border shadow-sm text-center">
                <div className="bg-muted rounded-lg h-16 w-16 flex items-center justify-center mb-6 mx-auto">
                    {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-card-foreground">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section 
        id="pricing" 
        className="py-20 scroll-mt-16"
        style={darkSectionBgStyle}
      >
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white text-shadow-lg shadow-black/50">Simple, Transparent Pricing</h2>
          <p className="text-white/90 mb-12 max-w-2xl mx-auto text-shadow shadow-black/50">Choose the plan that fits your business</p>
          <div className="flex flex-col lg:flex-row justify-center items-stretch gap-8">
            {/* Starter Plan */}
            <div className="w-full max-w-sm bg-card rounded-lg border border-border p-8 text-left flex flex-col shadow-lg">
              <div className="flex-grow">
                <h3 className="text-2xl font-bold text-card-foreground">Starter</h3>
                <p className="text-4xl font-extrabold mt-4 text-card-foreground">₱999<span className="text-lg font-medium text-muted-foreground">/month</span></p>
                <p className="text-muted-foreground mt-2">Perfect for small businesses. Try 7 days free!</p>
                <ul className="space-y-3 mt-6 text-card-foreground/90">
                  <li className="flex items-center"><CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" /><span>Up to 100 orders per month</span></li>
                  <li className="flex items-center"><CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" /><span>Basic menu management</span></li>
                  <li className="flex items-center"><CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" /><span>Store website included</span></li>
                  <li className="flex items-center"><CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" /><span>Basic sales reports</span></li>
                </ul>
              </div>
              <Link to="/signup" className="w-full mt-8 inline-block text-center bg-muted text-muted-foreground font-semibold py-3 px-6 rounded-lg hover:bg-accent transition-colors">
                Start 7-Day Trial
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="w-full max-w-sm bg-card rounded-lg border-2 border-primary p-8 text-left relative flex flex-col shadow-lg">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-foreground px-4 py-1 rounded-md text-sm font-semibold">
                Most Popular
              </div>
              <div className="flex-grow">
                <h3 className="text-2xl font-bold text-card-foreground">Pro</h3>
                <p className="text-4xl font-extrabold mt-4 text-card-foreground">₱2,499<span className="text-lg font-medium text-muted-foreground">/month</span></p>
                <p className="text-muted-foreground mt-2">For growing businesses. Try 7 days free!</p>
                <ul className="space-y-3 mt-6 text-card-foreground/90">
                  <li className="flex items-center"><CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" /><span>Unlimited orders per month</span></li>
                  <li className="flex items-center"><CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" /><span>Advanced menu management</span></li>
                  <li className="flex items-center"><CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" /><span>Store website included</span></li>
                  <li className="flex items-center"><CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" /><span>Advanced sales reports & analytics</span></li>
                  <li className="flex items-center"><CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" /><span>Promotions & discounts</span></li>
                  <li className="flex items-center"><CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" /><span>Staff management</span></li>
                  <li className="flex items-center"><CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" /><span>Priority customer support</span></li>
                </ul>
              </div>
              <Link to="/signup" className="w-full mt-8 inline-block text-center bg-primary text-primary-foreground font-semibold py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors">
                Start 7-Day Trial
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-muted/50 scroll-mt-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4 text-foreground">Get Started in 3 Simple Steps</h2>
          <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">Launching your online presence has never been easier.</p>
          <div className="flex flex-col md:flex-row justify-center items-start gap-8 md:gap-16">
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col items-center max-w-xs">
                <div className="bg-primary text-primary-foreground h-16 w-16 rounded-full flex items-center justify-center text-2xl font-bold mb-4 ring-8 ring-primary/20">{step.number}</div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer 
        className="py-16"
        style={darkSectionBgStyle}
      >
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white text-shadow-lg shadow-black/50">Start managing your shop today.</h2>
          <p className="mt-4 text-white/90 text-shadow shadow-black/50">Join hundreds of businesses thriving with Orderly.</p>
          <Link to="/signup" className="mt-8 inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold text-lg hover:bg-primary/90 transition-colors">
            Create My Store
          </Link>
          <p className="mt-8 text-sm text-secondary-foreground/60 text-shadow shadow-black/50">Powered by AppVanta Digital</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;