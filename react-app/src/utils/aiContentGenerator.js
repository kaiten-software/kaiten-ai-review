/**
 * AI Content Generator for Business Clients
 * Generates business-specific content based on business type
 */

// Business type to content mapping
const businessTypeContent = {
    salon: {
        qualities: ['Professional', 'Skilled', 'Friendly', 'Clean', 'Punctual', 'Creative', 'Stylish', 'Attentive'],
        feelings: ['Beautiful', 'Confident', 'Pampered', 'Refreshed', 'Stylish', 'Relaxed', 'Happy', 'Satisfied'],
        defaultServices: [
            { name: 'Haircut & Styling', price: '₹500', duration: '45 min', description: 'Professional haircut with styling' },
            { name: 'Hair Coloring', price: '₹2000', duration: '2 hours', description: 'Full color or highlights' },
            { name: 'Hair Treatment', price: '₹1500', duration: '1 hour', description: 'Deep conditioning & repair' }
        ],
        searchKeywords: ['Best salon near me', 'Top hair salon', 'Professional haircut', 'Hair coloring experts', 'Bridal makeup', 'Hair spa treatment']
    },
    spa: {
        qualities: ['Relaxing', 'Professional', 'Clean', 'Peaceful', 'Luxurious', 'Therapeutic', 'Calming', 'Rejuvenating'],
        feelings: ['Relaxed', 'Rejuvenated', 'Peaceful', 'Refreshed', 'Pampered', 'Calm', 'Restored', 'Blissful'],
        defaultServices: [
            { name: 'Swedish Massage', price: '₹2500', duration: '60 min', description: 'Relaxing full body massage' },
            { name: 'Deep Tissue Massage', price: '₹3000', duration: '75 min', description: 'Therapeutic deep pressure' },
            { name: 'Facial Treatment', price: '₹2000', duration: '60 min', description: 'Rejuvenating facial' }
        ],
        searchKeywords: ['Best spa near me', 'Luxury spa', 'Massage therapy', 'Wellness center', 'Spa treatments', 'Relaxation spa']
    },
    restaurant: {
        qualities: ['Delicious', 'Fresh', 'Authentic', 'Fast', 'Friendly', 'Value', 'Clean', 'Tasty'],
        feelings: ['Satisfied', 'Happy', 'Full', 'Delighted', 'Impressed', 'Content', 'Pleased', 'Grateful'],
        defaultServices: [
            { name: 'Lunch Special', price: '₹350', duration: '30 min', description: 'Daily lunch menu' },
            { name: 'Dinner Menu', price: '₹500', duration: '45 min', description: 'Full dinner service' },
            { name: 'Family Combo', price: '₹1200', duration: '45 min', description: 'Meal for 4 people' }
        ],
        searchKeywords: ['Best restaurant near me', 'Top dining', 'Good food', 'Family restaurant', 'Best cuisine', 'Food delivery']
    },
    cafe: {
        qualities: ['Cozy', 'Friendly', 'Fresh', 'Quality', 'Welcoming', 'Clean', 'Tasty', 'Affordable'],
        feelings: ['Relaxed', 'Happy', 'Satisfied', 'Comfortable', 'Energized', 'Content', 'Pleased', 'Refreshed'],
        defaultServices: [
            { name: 'Coffee & Beverages', price: '₹150', duration: '10 min', description: 'Specialty coffee drinks' },
            { name: 'Breakfast', price: '₹250', duration: '20 min', description: 'Fresh breakfast items' },
            { name: 'Snacks & Pastries', price: '₹100', duration: '5 min', description: 'Fresh baked goods' }
        ],
        searchKeywords: ['Best cafe near me', 'Coffee shop', 'Cozy cafe', 'Best coffee', 'Breakfast cafe', 'Wi-Fi cafe']
    },
    gym: {
        qualities: ['Motivating', 'Professional', 'Clean', 'Modern', 'Supportive', 'Results-Driven', 'Equipped', 'Friendly'],
        feelings: ['Energized', 'Motivated', 'Strong', 'Healthy', 'Accomplished', 'Confident', 'Fit', 'Empowered'],
        defaultServices: [
            { name: 'Gym Membership', price: '₹2000/month', duration: 'Unlimited', description: 'Full gym access' },
            { name: 'Personal Training', price: '₹3000/month', duration: '1 hour/session', description: 'One-on-one training' },
            { name: 'Group Classes', price: '₹1500/month', duration: '45 min/class', description: 'Yoga, Zumba, HIIT' }
        ],
        searchKeywords: ['Best gym near me', 'Fitness center', 'Personal training', 'Gym membership', 'Workout classes', '24/7 gym']
    },
    clinic: {
        qualities: ['Professional', 'Caring', 'Clean', 'Efficient', 'Knowledgeable', 'Trustworthy', 'Thorough', 'Compassionate'],
        feelings: ['Relieved', 'Cared for', 'Healthy', 'Confident', 'Grateful', 'Safe', 'Reassured', 'Better'],
        defaultServices: [
            { name: 'General Consultation', price: '₹500', duration: '30 min', description: 'Doctor consultation' },
            { name: 'Health Checkup', price: '₹1500', duration: '1 hour', description: 'Complete health screening' },
            { name: 'Treatment', price: 'Varies', duration: 'As needed', description: 'Medical treatment' }
        ],
        searchKeywords: ['Best clinic near me', 'Medical clinic', 'Doctor consultation', 'Healthcare center', 'Family clinic', 'Walk-in clinic']
    },
    dental: {
        qualities: ['Professional', 'Gentle', 'Clean', 'Thorough', 'Modern', 'Caring', 'Skilled', 'Painless'],
        feelings: ['Confident', 'Relieved', 'Healthy', 'Happy', 'Grateful', 'Comfortable', 'Satisfied', 'Cared for'],
        defaultServices: [
            { name: 'Dental Checkup', price: '₹500', duration: '30 min', description: 'Routine examination' },
            { name: 'Teeth Cleaning', price: '₹1000', duration: '45 min', description: 'Professional cleaning' },
            { name: 'Dental Treatment', price: 'Varies', duration: 'As needed', description: 'Various treatments' }
        ],
        searchKeywords: ['Best dentist near me', 'Dental clinic', 'Teeth cleaning', 'Dental care', 'Family dentist', 'Painless dentistry']
    },
    auto: {
        qualities: ['Reliable', 'Professional', 'Honest', 'Skilled', 'Fast', 'Affordable', 'Trustworthy', 'Quality'],
        feelings: ['Relieved', 'Confident', 'Satisfied', 'Grateful', 'Impressed', 'Secure', 'Happy', 'Reassured'],
        defaultServices: [
            { name: 'Car Service', price: '₹2000', duration: '2 hours', description: 'Complete car servicing' },
            { name: 'Oil Change', price: '₹800', duration: '30 min', description: 'Engine oil replacement' },
            { name: 'Repairs', price: 'Varies', duration: 'As needed', description: 'Various repairs' }
        ],
        searchKeywords: ['Best car service near me', 'Auto repair shop', 'Car mechanic', 'Vehicle service', 'Trusted garage', 'Car maintenance']
    },
    retail: {
        qualities: ['Quality', 'Affordable', 'Variety', 'Friendly', 'Clean', 'Organized', 'Helpful', 'Convenient'],
        feelings: ['Satisfied', 'Happy', 'Pleased', 'Excited', 'Content', 'Grateful', 'Delighted', 'Impressed'],
        defaultServices: [
            { name: 'Shopping', price: 'Varies', duration: 'As needed', description: 'Browse our collection' },
            { name: 'Personal Shopping', price: 'Free', duration: '30 min', description: 'Assisted shopping' },
            { name: 'Gift Wrapping', price: '₹50', duration: '10 min', description: 'Professional wrapping' }
        ],
        searchKeywords: ['Best store near me', 'Shopping', 'Retail store', 'Quality products', 'Good prices', 'Variety store']
    },
    hotel: {
        qualities: ['Comfortable', 'Clean', 'Luxurious', 'Welcoming', 'Professional', 'Spacious', 'Modern', 'Convenient'],
        feelings: ['Relaxed', 'Comfortable', 'Pampered', 'Rested', 'Happy', 'Satisfied', 'Refreshed', 'Content'],
        defaultServices: [
            { name: 'Room Stay', price: '₹3000/night', duration: '24 hours', description: 'Comfortable accommodation' },
            { name: 'Dining', price: 'Varies', duration: 'As needed', description: 'Restaurant services' },
            { name: 'Room Service', price: 'Varies', duration: '30 min', description: 'In-room dining' }
        ],
        searchKeywords: ['Best hotel near me', 'Hotel booking', 'Accommodation', 'Luxury hotel', 'Budget hotel', 'Hotel rooms']
    },
    bakery: {
        qualities: ['Fresh', 'Delicious', 'Quality', 'Variety', 'Affordable', 'Clean', 'Tasty', 'Artisan'],
        feelings: ['Happy', 'Satisfied', 'Delighted', 'Pleased', 'Content', 'Excited', 'Grateful', 'Impressed'],
        defaultServices: [
            { name: 'Fresh Bread', price: '₹50', duration: 'Daily', description: 'Freshly baked bread' },
            { name: 'Cakes & Pastries', price: 'Varies', duration: 'Fresh daily', description: 'Variety of baked goods' },
            { name: 'Custom Cakes', price: '₹500+', duration: '24 hours', description: 'Made to order' }
        ],
        searchKeywords: ['Best bakery near me', 'Fresh bread', 'Cakes and pastries', 'Artisan bakery', 'Custom cakes', 'Baked goods']
    },
    photography: {
        qualities: ['Creative', 'Professional', 'Skilled', 'Artistic', 'Reliable', 'Quality', 'Experienced', 'Friendly'],
        feelings: ['Happy', 'Excited', 'Satisfied', 'Impressed', 'Grateful', 'Confident', 'Delighted', 'Pleased'],
        defaultServices: [
            { name: 'Portrait Photography', price: '₹5000', duration: '2 hours', description: 'Professional portraits' },
            { name: 'Event Photography', price: '₹10000', duration: '4 hours', description: 'Event coverage' },
            { name: 'Photo Editing', price: '₹500', duration: '1 day', description: 'Professional editing' }
        ],
        searchKeywords: ['Best photographer near me', 'Photography studio', 'Professional photos', 'Event photographer', 'Portrait photography', 'Photo shoot']
    },
    consulting: {
        qualities: ['Professional', 'Knowledgeable', 'Reliable', 'Expert', 'Helpful', 'Efficient', 'Trustworthy', 'Experienced'],
        feelings: ['Confident', 'Informed', 'Satisfied', 'Grateful', 'Reassured', 'Empowered', 'Supported', 'Impressed'],
        defaultServices: [
            { name: 'Consultation', price: '₹2000/hour', duration: '1 hour', description: 'Expert advice' },
            { name: 'Project Work', price: 'Varies', duration: 'As needed', description: 'Custom projects' },
            { name: 'Training', price: '₹5000', duration: '3 hours', description: 'Professional training' }
        ],
        searchKeywords: ['Best consultant near me', 'Professional consulting', 'Expert advice', 'Business consultant', 'Consulting services', 'Professional help']
    },
    education: {
        qualities: ['Knowledgeable', 'Patient', 'Professional', 'Supportive', 'Experienced', 'Helpful', 'Skilled', 'Caring'],
        feelings: ['Confident', 'Knowledgeable', 'Empowered', 'Grateful', 'Motivated', 'Inspired', 'Satisfied', 'Accomplished'],
        defaultServices: [
            { name: 'Classes', price: '₹3000/month', duration: '1 hour/day', description: 'Regular classes' },
            { name: 'Private Tutoring', price: '₹500/hour', duration: '1 hour', description: 'One-on-one teaching' },
            { name: 'Workshops', price: '₹2000', duration: '3 hours', description: 'Skill workshops' }
        ],
        searchKeywords: ['Best classes near me', 'Education center', 'Training institute', 'Tutoring services', 'Skill development', 'Learning center']
    },
    other: {
        qualities: ['Professional', 'Friendly', 'Quality', 'Reliable', 'Efficient', 'Helpful', 'Clean', 'Trustworthy'],
        feelings: ['Satisfied', 'Happy', 'Pleased', 'Grateful', 'Content', 'Impressed', 'Confident', 'Relieved'],
        defaultServices: [
            { name: 'Service 1', price: 'Varies', duration: 'As needed', description: 'Primary service' },
            { name: 'Service 2', price: 'Varies', duration: 'As needed', description: 'Additional service' },
            { name: 'Service 3', price: 'Varies', duration: 'As needed', description: 'Premium service' }
        ],
        searchKeywords: ['Best service near me', 'Top-rated business', 'Professional service', 'Quality service', 'Trusted provider', 'Excellent service']
    }
};

/**
 * Generate AI content for a business based on its type
 * @param {string} businessType - Type of business
 * @returns {object} Generated content including qualities, feelings, services, and keywords
 */
export function generateBusinessContent(businessType) {
    const type = businessType.toLowerCase();
    const content = businessTypeContent[type] || businessTypeContent.other;

    return {
        qualities: content.qualities,
        feelings: content.feelings,
        services: content.defaultServices,
        searchKeywords: content.searchKeywords
    };
}

/**
 * Generate default staff members based on business type
 * @param {string} businessType - Type of business
 * @returns {array} Array of staff members
 */
export function generateDefaultStaff(businessType) {
    const type = businessType.toLowerCase();

    const staffTemplates = {
        salon: [
            { name: 'Senior Stylist', role: 'Master Stylist', experience: '10+ years', specialty: 'Hair Styling' },
            { name: 'Color Specialist', role: 'Hair Colorist', experience: '8 years', specialty: 'Hair Coloring' }
        ],
        spa: [
            { name: 'Head Therapist', role: 'Spa Director', experience: '15 years', specialty: 'Massage Therapy' },
            { name: 'Wellness Expert', role: 'Therapist', experience: '10 years', specialty: 'Holistic Wellness' }
        ],
        restaurant: [
            { name: 'Head Chef', role: 'Executive Chef', experience: '15 years', specialty: 'Culinary Arts' },
            { name: 'Sous Chef', role: 'Chef', experience: '8 years', specialty: 'Menu Creation' }
        ],
        gym: [
            { name: 'Head Trainer', role: 'Fitness Director', experience: '12 years', specialty: 'Strength Training' },
            { name: 'Yoga Instructor', role: 'Instructor', experience: '8 years', specialty: 'Yoga & Flexibility' }
        ],
        default: [
            { name: 'Team Lead', role: 'Senior Professional', experience: '10 years', specialty: 'Customer Service' },
            { name: 'Specialist', role: 'Professional', experience: '5 years', specialty: 'Quality Service' }
        ]
    };

    return staffTemplates[type] || staffTemplates.default;
}
