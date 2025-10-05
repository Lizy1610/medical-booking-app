import React, { useState, useEffect } from 'react';

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  location: string;
  rating?: number;
  reviews: string;
  category: string;
  image?: string;
  isFavorite?: boolean;
}

const DoctorsList: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [imageErrors, setImageErrors] = useState<{[key: number]: boolean}>({});
  const [favorites, setFavorites] = useState<{[key: number]: boolean}>({});

  // Doctores con nombres de imagen simplificados
  const doctors: Doctor[] = [
    {
      id: 1,
      name: 'Dr. David Patel',
      specialty: 'Cardiólogo',
      location: 'Centro de Cardiología, USA',
      rating: 4.8,
      reviews: '1,872 Reseñas',
      category: 'cardiólogo',
      image: '../assets/doctors/behnazsabaa_Portrait_of_Smiling_Male_Medical_Doctor__Style_of_H_0996798e-acc5-48e2-9b18-79c922a9f29b.png',
    },
    {
      id: 2,
      name: 'Dra. Jessica Turner',
      specialty: 'Ginecóloga',
      location: 'Clínica de la Mujer, Seattle, USA',
      rating: 4.9,
      reviews: '127 Reseñas',
      category: 'ginecólogo',
      image: '../assets/doctors/behnazsabaa_Portrait_of_Smiling_male_Medical_Doctor__Style_of_H_1c086a49-54f7-49ae-83b7-e3470a13be23.png',
    },
    {
      id: 3,
      name: 'Dr. Michael Johnson',
      specialty: 'Cirugía Ortopédica',
      location: 'Maple Associates, NY, USA',
      rating: 4.7,
      reviews: '5,223 Reseñas',
      category: 'ortopedia',
      image: '../assets/doctors/behnazsabaa_Portrait_of_Smiling_male_Medical_Doctor__Style_of_H_22f8a7ff-a589-4d1b-880a-172332b8a241.png',
    },
    {
      id: 4,
      name: 'Dra. Emily Walker',
      specialty: 'Pediatría',
      location: 'Clínica de Pediatría Serenity',
      rating: 4.6,
      reviews: '405 Reseñas',
      category: 'pediatría',
      image: '../assets/doctors/behnazsabaa_Portrait_of_Smiling_Male_Medical_Doctor__Style_of_H_632e5c2e-ed2d-4cbf-9f2f-3b394f244150.png',
    },
    {
      id: 5,
      name: 'Dr. Carlos Rodríguez',
      specialty: 'Dentista',
      location: 'Centro Dental Moderno, Madrid',
      rating: 4.8,
      reviews: '892 Reseñas',
      category: 'dentista',
      image: '../assets/doctors/behnazsabaa_Portrait_of_Smiling_male_Medical_Doctor__Style_of_H_99ad71b0-4530-4893-90cd-c30053bc1b3a.png',
    },
    {
      id: 6,
      name: 'Dra. María González',
      specialty: 'Médico General',
      location: 'Clínica Familiar Central',
      rating: 4.6,
      reviews: '2,145 Reseñas',
      category: 'general',
      image: '../assets/doctors/behnazsabaa_Portrait_of_Smiling_male_Medical_Doctor__Style_of_H_fdbc4308-d873-4135-88e3-7242607c8c84.png',
    }
  ];

  const categories = [
    { id: 'todos', label: 'Todos' },
    { id: 'general', label: 'General' },
    { id: 'cardiólogo', label: 'Cardiólogo' },
    { id: 'dentista', label: 'Dentista' }
  ];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesCategory = activeCategory === 'todos' || doctor.category === activeCategory;
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleImageError = (doctorId: number) => {
    setImageErrors(prev => ({ ...prev, [doctorId]: true }));
    console.log(`Error cargando imagen para doctor ${doctorId}`);
  };

  const toggleFavorite = (doctorId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setFavorites(prev => ({
      ...prev,
      [doctorId]: !prev[doctorId]
    }));
  };

  // SVG para el corazón con contorno
  const HeartOutlineIcon = ({ isFilled }: { isFilled: boolean }) => (
    <svg 
      width="20" 
      height="20" 
      viewBox="0 0 24 24" 
      fill={isFilled ? "#ff4757" : "none"} 
      stroke={isFilled ? "#ff4757" : "#ccc"} 
      strokeWidth="2"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );

  // SVG para la lupa (contorno)
  const SearchIcon = () => (
    <svg 
      width="18" 
      height="18" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="#666" 
      strokeWidth="2"
    >
      <circle cx="11" cy="11" r="8"/>
      <path d="m21 21-4.35-4.35"/>
    </svg>
  );

  // SVG para la ubicación (contorno estilo Google Maps)
  const LocationIcon = () => (
    <svg 
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="#666" 
      strokeWidth="2"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );

  // SVG para el teléfono
  const PhoneIcon = () => (
    <svg 
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="#666" 
      strokeWidth="2"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  );

  // SVG para la estrella
  const StarIcon = () => (
    <svg 
      width="14" 
      height="14" 
      viewBox="0 0 24 24" 
      fill="#ffc107" 
      stroke="#ffc107" 
      strokeWidth="1"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );

  // Estilos
  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#fff',
      minHeight: '100vh',
    },
    header: {
      marginBottom: '24px',
    },
    title: {
      fontSize: '24px',
      fontWeight: '700',
      margin: '0 0 16px 0',
      color: '#000',
      textAlign: 'left',
      letterSpacing: '-0.2px',
    },
    searchContainer: {
      width: '100%',
      position: 'relative',
    },
    searchInput: {
      width: '100%',
      padding: '12px 16px 12px 44px',
      border: '1px solid #e0e0e0',
      borderRadius: '12px',
      fontSize: '14px',
      backgroundColor: '#fafafa',
      outline: 'none',
      boxSizing: 'border-box' as const,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    },
    searchIcon: {
      position: 'absolute',
      left: '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 1,
    },
    filtersContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '12px',
      marginBottom: '20px',
    },
    filterTab: {
      padding: '12px 24px',
      cursor: 'pointer',
      color: '#666',
      fontSize: '14px',
      fontWeight: '500',
      border: '1px solid #e0e0e0',
      backgroundColor: '#fff',
      borderRadius: '25px',
      whiteSpace: 'nowrap',
      flexShrink: 0,
      transition: 'all 0.2s ease',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    },
    filterTabActive: {
      color: '#000',
      fontWeight: '600',
      border: '1px solid #000',
      backgroundColor: '#f8f9fa',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    },
    resultsInfo: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      fontSize: '14px',
      padding: '0 4px',
    },
    resultsCount: {
      color: '#666',
      fontWeight: '500',
    },
    sortContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    sortText: {
      color: '#666',
    },
    sortNumber: {
      fontWeight: '600',
      color: '#000',
    },
    doctorsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    doctorCard: {
      display: 'flex',
      alignItems: 'flex-start',
      padding: '20px',
      border: '1px solid #f0f0f0',
      borderRadius: '16px',
      backgroundColor: '#fff',
      transition: 'all 0.3s ease',
      gap: '16px',
      position: 'relative',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    },
    imageContainer: {
      width: '60px',
      height: '60px',
      borderRadius: '12px',
      overflow: 'hidden',
      backgroundColor: '#f8f9fa',
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
    },
    doctorImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    imagePlaceholder: {
      width: '100%',
      height: '100%',
      backgroundColor: '#e9ecef',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '18px',
      borderRadius: '12px',
      color: '#6c757d',
    },
    doctorContent: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      width: '100%',
      gap: '16px',
    },
    doctorInfo: {
      flex: 1,
    },
    doctorHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '8px',
    },
    doctorName: {
      margin: '0 0 6px 0',
      fontSize: '16px',
      fontWeight: '600',
      color: '#000',
      lineHeight: '1.4',
      flex: 1,
    },
    favoriteButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '4px',
      marginLeft: '8px',
      transition: 'all 0.2s ease',
      color:'#ccc',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    doctorSpecialty: {
      margin: '0 0 6px 0',
      fontSize: '14px',
      color: '#666',
      lineHeight: '1.4',
      fontWeight: '500',
    },
    locationContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '8px',
    },
    locationIcon: {
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    doctorLocation: {
      margin: 0,
      fontSize: '14px',
      color: '#666',
      lineHeight: '1.4',
    },
    doctorRating: {
      display: 'flex',
      alignItems: 'center',
      fontSize: '14px',
      gap: '8px',
      flexShrink: 0,
    },
    ratingContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
    starIcon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    phoneIcon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: '4px',
    },
    rating: {
      fontWeight: '600',
      color: '#000',
    },
    ratingText: {
      color: '#666',
      whiteSpace: 'nowrap',
    },
  };

  return (
    <div style={styles.container}>
      {/* Header - Con lupa SVG en el buscador */}
      <div style={styles.header}>
        <h1 style={styles.title}>Todos los Doctores</h1>
        <div style={styles.searchContainer}>
          <div style={styles.searchIcon}>
            <SearchIcon />
          </div>
          <input 
            type="text" 
            placeholder="Buscar doctores..." 
            style={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Filter Tabs - Bordes muy redondeados como medio círculo */}
      <div style={styles.filtersContainer}>
        {categories.map(category => (
          <div
            key={category.id}
            style={
              activeCategory === category.id 
                ? { ...styles.filterTab, ...styles.filterTabActive }
                : styles.filterTab
            }
            onClick={() => setActiveCategory(category.id)}
          >
            {category.label}
          </div>
        ))}
      </div>

      {/* Results Info */}
      <div style={styles.resultsInfo}>
        <span style={styles.resultsCount}>{filteredDoctors.length} encontrados</span>
        <div style={styles.sortContainer}>
          <span style={styles.sortText}>Por defecto</span>
          <span style={styles.sortNumber}>11</span>
        </div>
      </div>

      {/* Doctors List */}
      <div style={styles.doctorsList}>
        {filteredDoctors.map(doctor => (
          <div key={doctor.id} style={styles.doctorCard}>
            {/* Doctor Image */}
            <div style={styles.imageContainer}>
              {doctor.image && !imageErrors[doctor.id] ? (
                <img 
                  src={doctor.image} 
                  alt={doctor.name}
                  style={styles.doctorImage}
                  onError={() => handleImageError(doctor.id)}
                />
              ) : (
                <div style={styles.imagePlaceholder}>
                  👨‍⚕️
                </div>
              )}
            </div>
            
            <div style={styles.doctorContent}>
              <div style={styles.doctorInfo}>
                {/* Header con nombre y botón de favorito */}
                <div style={styles.doctorHeader}>
                  <h3 style={styles.doctorName}>{doctor.name}</h3>
                  <button 
                    style={styles.favoriteButton}
                    onClick={(e) => toggleFavorite(doctor.id, e)}
                    title={favorites[doctor.id] ? "Quitar de favoritos" : "Agregar a favoritos"}
                  >
                    <HeartOutlineIcon isFilled={favorites[doctor.id]} />
                  </button>
                </div>
                
                {/* Especialidad */}
                <p style={styles.doctorSpecialty}>{doctor.specialty}</p>
                
                {/* Ubicación con icono SVG */}
                <div style={styles.locationContainer}>
                  <div style={styles.locationIcon}>
                    <LocationIcon />
                  </div>
                  <p style={styles.doctorLocation}>{doctor.location}</p>
                </div>
              </div>
              
              {/* Rating y reseñas con iconos SVG */}
              <div style={styles.doctorRating}>
                <div style={styles.phoneIcon}>
                  <PhoneIcon />
                </div>
                {doctor.rating && (
                  <div style={styles.ratingContainer}>
                    <div style={styles.starIcon}>
                      <StarIcon />
                    </div>
                    <span style={styles.rating}>{doctor.rating}</span>
                  </div>
                )}
                <span style={styles.ratingText}>{doctor.reviews}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorsList;