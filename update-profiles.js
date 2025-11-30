// Run this in your browser console to update existing profiles
// Open browser console (F12) and paste this code

const updateProfiles = () => {
  // Get all existing users
  const usersJson = localStorage.getItem('skilllink_users');
  if (!usersJson) {
    console.log('No users found');
    return;
  }
  
  const users = JSON.parse(usersJson);
  console.log('Found users:', users);
  
  // Get existing profiles
  let profilesJson = localStorage.getItem('skilllink_profiles');
  let profiles = profilesJson ? JSON.parse(profilesJson) : [];
  
  // Create or update profile for each user
  users.forEach(user => {
    const existingProfile = profiles.find(p => p.id === user.id);
    
    if (existingProfile) {
      // Update existing profile with new fields
      existingProfile.is_verified = existingProfile.is_verified || false;
      existingProfile.rating = existingProfile.rating || 0.0;
      existingProfile.total_reviews = existingProfile.total_reviews || 0;
      existingProfile.updated_at = new Date().toISOString();
      console.log('Updated profile for:', user.email);
    } else {
      // Create new profile
      profiles.push({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || user.email.split('@')[0],
        is_verified: false,
        rating: 0.0,
        total_reviews: 0,
        created_at: user.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      console.log('Created profile for:', user.email);
    }
  });
  
  // Save updated profiles
  localStorage.setItem('skilllink_profiles', JSON.stringify(profiles));
  console.log('✅ All profiles updated!');
  console.log('Profiles:', profiles);
  console.log('Please refresh the page to see changes.');
};

updateProfiles();
