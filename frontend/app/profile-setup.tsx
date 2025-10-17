import { useState, useRef, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { register } from "../src/lib/auth";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Modal,
  Pressable,
  Linking,
  Alert,
  Animated,
  Switch,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Types para cumplimiento normativo
interface PrivacyPreferences {
  marketing: boolean;
  analytics: boolean;
  thirdParty: boolean;
  dataProcessing: boolean;
  essential: boolean;
}

interface ComplianceData {
  consentGiven: boolean;
  consentTimestamp: string;
  preferences: PrivacyPreferences;
  privacyPolicyVersion: string;
  legalBasis: string;
  dataProcessingRecords: string[];
}

// Datos de las políticas
const POLICY_DATA = {
  privacy: {
    title: "Política de Privacidad",
    icon: "lock-closed",
    description: "Cómo protegemos y usamos tus datos",
    sections: [
      {
        title: "Datos que Recopilamos",
        icon: "document-text",
        items: [
          "Información personal: nombre, email, fecha de nacimiento",
          "Datos de perfil: foto, género, preferencias",
          "Datos técnicos: IP, dispositivo, cookies",
          "Datos de uso: interacciones, tiempo en app"
        ]
      },
      {
        title: "Cómo Usamos Tus Datos",
        icon: "shield-checkmark",
        items: [
          "Proveer y mantener el servicio",
          "Personalizar tu experiencia",
          "Comunicaciones importantes",
          "Mejora continua de la plataforma"
        ]
      },
      {
        title: "Bases Legales GDPR",
        icon: "ribbon",
        items: [
          "Art. 6(1)(a): Consentimiento explícito",
          "Art. 6(1)(b): Ejecución del contrato",
          "Art. 6(1)(f): Intereses legítimos",
          "Art. 9(2)(a): Datos sensibles con consentimiento"
        ]
      },
      {
        title: "Tus Derechos",
        icon: "person",
        items: [
          "Acceso y rectificación de datos",
          "Portabilidad a otros servicios",
          "Limitación del tratamiento",
          "Eliminación (derecho al olvido)"
        ]
      }
    ]
  },
  terms: {
    title: "Términos de Servicio",
    icon: "business",
    description: "Condiciones de uso de la plataforma",
    sections: [
      {
        title: "Aceptación de Términos",
        icon: "checkmark-circle",
        items: [
          "Debes tener al menos 16 años de edad",
          "Información veraz y actualizada",
          "Uso responsable de la plataforma",
          "Respeto a otros usuarios"
        ]
      },
      {
        title: "Cuenta y Seguridad",
        icon: "key",
        items: [
          "Confidencialidad de credenciales",
          "Notificación inmediata de acceso no autorizado",
          "Un usuario por cuenta",
          "Prohibición de transferir cuentas"
        ]
      },
      {
        title: "Contenido del Usuario",
        icon: "images",
        items: [
          "Derechos sobre tu contenido",
          "Licencia no exclusiva para la plataforma",
          "Prohibición de contenido ilegal",
          "Moderación y eliminación"
        ]
      },
      {
        title: "Limitaciones",
        icon: "warning",
        items: [
          "Servicio 'tal cual' sin garantías",
          "Limitación de responsabilidad",
          "Modificación de términos",
          "Ley aplicable y jurisdicción"
        ]
      }
    ]
  },
  cookies: {
    title: "Política de Cookies",
    icon: "nutrition",
    description: "Uso de cookies y tecnologías similares",
    sections: [
      {
        title: "Cookies Esenciales",
        icon: "shield-checkmark",
        items: [
          "Autenticación y seguridad",
          "Preferencias del usuario",
          "Funcionalidad básica",
          "No requieren consentimiento"
        ]
      },
      {
        title: "Cookies Analíticas",
        icon: "analytics",
        items: [
          "Análisis de tráfico y uso",
          "Medición de rendimiento",
          "Mejora de características",
          "Datos agregados y anónimos"
        ]
      },
      {
        title: "Cookies de Marketing",
        icon: "megaphone",
        items: [
          "Publicidad personalizada",
          "Segmentación de audiencias",
          "Medición de campañas",
          "Requieren consentimiento explícito"
        ]
      },
      {
        title: "Gestión de Cookies",
        icon: "settings",
        items: [
          "Configuración en preferencias",
          "Revocación en cualquier momento",
          "Eliminación desde el navegador",
          "Consecuencias de deshabilitar"
        ]
      }
    ]
  },
  dataProcessing: {
    title: "Acuerdo de Procesamiento",
    icon: "settings",
    description: "Bases legales del tratamiento",
    sections: [
      {
        title: "Finalidades del Tratamiento",
        icon: "flag",
        items: [
          "Gestión de cuenta y perfil",
          "Prestación de servicios contratados",
          "Cumplimiento de obligaciones legales",
          "Comunicaciones de servicio"
        ]
      },
      {
        title: "Medidas de Seguridad",
        icon: "lock-closed",
        items: [
          "Cifrado de datos en tránsito y reposo",
          "Acceso restringido y auditado",
          "Copias de seguridad seguras",
          "Procedimientos de respuesta a incidentes"
        ]
      },
      {
        title: "Transferencias Internacionales",
        icon: "globe",
        items: [
          "Cláusulas contractuales tipo UE",
          "Evaluación de adecuación",
          "Garantías adicionales de protección",
          "Transparencia en transferencias"
        ]
      },
      {
        title: "Retención y Eliminación",
        icon: "calendar",
        items: [
          "Periodos basados en finalidad",
          "Eliminación segura al finalizar",
          "Derecho de supresión inmediato",
          "Archivo para fines legales"
        ]
      }
    ]
  }
};

// Modal de Visualización de Políticas
function PolicyDetailModal({
  visible,
  policyType,
  onClose,
}: {
  visible: boolean;
  policyType: keyof typeof POLICY_DATA;
  onClose: () => void;
}) {
  const policy = POLICY_DATA[policyType];
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : SCREEN_HEIGHT,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable style={policyStyles.overlay} onPress={onClose}>
        <Animated.View 
          style={[
            policyStyles.animatedContainer, 
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
          <Pressable style={policyStyles.card} onPress={() => {}}>
            {/* Header */}
            <View style={policyStyles.header}>
              <View style={policyStyles.headerIcon}>
                <Ionicons name={policy.icon as any} size={28} color="#0F172A" />
              </View>
              <Text style={policyStyles.title}>{policy.title}</Text>
              <Text style={policyStyles.subtitle}>{policy.description}</Text>
            </View>

            <ScrollView 
              style={policyStyles.scrollContent}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={policyStyles.scrollContainer}
            >
              {policy.sections.map((section, index) => (
                <View key={index} style={policyStyles.section}>
                  <View style={policyStyles.sectionHeader}>
                    <View style={policyStyles.sectionIcon}>
                      <Ionicons name={section.icon as any} size={20} color="#0F172A" />
                    </View>
                    <Text style={policyStyles.sectionTitle}>{section.title}</Text>
                  </View>
                  
                  <View style={policyStyles.sectionContent}>
                    {section.items.map((item, itemIndex) => (
                      <View key={itemIndex} style={policyStyles.item}>
                        <View style={policyStyles.bullet}>
                          <Ionicons name="ellipse" size={8} color="#0F172A" />
                        </View>
                        <Text style={policyStyles.itemText}>{item}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}

              {/* Footer Informativo */}
              <View style={policyStyles.infoSection}>
                <View style={policyStyles.infoHeader}>
                  <Ionicons name="information-circle" size={20} color="#0F172A" />
                  <Text style={policyStyles.infoTitle}>Información Importante</Text>
                </View>
                <View style={policyStyles.infoContent}>
                  <Text style={policyStyles.infoText}>
                    • Versión actual: 2.3{'\n'}
                    • Última actualización: {new Date().toLocaleDateString()}{'\n'}
                    • Contacto DPO: dpo@tudominio.com{'\n'}
                    • Autoridad supervisora: AEPD (España)
                  </Text>
                </View>
              </View>
            </ScrollView>

            {/* Footer */}
            <View style={policyStyles.footer}>
              <TouchableOpacity 
                style={policyStyles.closeButton}
                onPress={onClose}
              >
                <Ionicons name="close" size={20} color="#6B7280" />
                <Text style={policyStyles.closeText}>Cerrar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={policyStyles.acceptButton}
                onPress={onClose}
              >
                <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                <Text style={policyStyles.acceptText}>Entendido</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

// Modal de Resultado
function ResultModal({
  visible,
  type,
  title,
  subtitle,
  primaryLabel,
  onPrimary,
  onRequestClose,
}: {
  visible: boolean;
  type: "success" | "error";
  title: string;
  subtitle?: string;
  primaryLabel: string;
  onPrimary: () => void;
  onRequestClose: () => void;
}) {
  const isSuccess = type === "success";
  const iconBg = isSuccess ? "#A7D7C5" : "#FEE2E2";
  const iconColor = isSuccess ? "#0F172A" : "#B91C1C";

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onRequestClose}>
      <Pressable style={m.overlay} onPress={onRequestClose}>
        <Pressable style={m.card} onPress={() => {}}>
          <View style={[m.iconCircle, { backgroundColor: iconBg }]}>
            <Ionicons name={isSuccess ? "checkmark" : "alert"} size={36} color={iconColor} />
          </View>

          <Text style={m.title}>{title}</Text>
          {!!subtitle && <Text style={m.subtitle}>{subtitle}</Text>}

          <TouchableOpacity style={m.primaryBtn} onPress={onPrimary} activeOpacity={0.9}>
            <Text style={m.primaryText}>{primaryLabel}</Text>
          </TouchableOpacity>

        </Pressable>
      </Pressable>
    </Modal>
  );
}

// Modal de Consentimiento de Privacidad
function PrivacyConsentModal({
  visible,
  onAccept,
  onReject,
  onRequestClose,
  onPreferencesChange,
  initialPreferences,
}: {
  visible: boolean;
  onAccept: (preferences: PrivacyPreferences, compliance: ComplianceData) => void;
  onReject: () => void;
  onRequestClose: () => void;
  onPreferencesChange: (preferences: PrivacyPreferences) => void;
  initialPreferences: PrivacyPreferences;
}) {
  const [preferences, setPreferences] = useState<PrivacyPreferences>(initialPreferences);
  const [documentsAccepted, setDocumentsAccepted] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    legal: true,
    preferences: false,
    rights: false,
    compliance: false
  });
  const [selectedPolicy, setSelectedPolicy] = useState<keyof typeof POLICY_DATA | null>(null);

  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : SCREEN_HEIGHT,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const updatePreference = (key: keyof PrivacyPreferences, value: boolean) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    onPreferencesChange(newPreferences);
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleAccept = () => {
    if (!documentsAccepted) {
      Alert.alert(
        "Documentos Requeridos", 
        "Debes aceptar los documentos legales para continuar con el registro."
      );
      return;
    }

    const complianceRecord: ComplianceData = {
      consentGiven: true,
      consentTimestamp: new Date().toISOString(),
      preferences: preferences,
      privacyPolicyVersion: "2.3",
      legalBasis: "consent",
      dataProcessingRecords: [
        "registration_data",
        "preferences_consent",
        "compliance_tracking"
      ]
    };

    onAccept(preferences, complianceRecord);
  };

  const openPolicyDetail = (policyType: keyof typeof POLICY_DATA) => {
    setSelectedPolicy(policyType);
  };

  const handleRightToBeForgotten = () => {
    Alert.alert(
      "Derecho al Olvido - GDPR Art. 17",
      "Puedes solicitar la eliminación completa de tus datos personales en cualquier momento. Esta acción es irreversible.",
      [
        {
          text: "Más Información",
          onPress: () => openPolicyDetail('privacy')
        },
        {
          text: "Entendido",
          style: "default"
        }
      ]
    );
  };

  const handleDataPortability = () => {
    Alert.alert(
      "Portabilidad de Datos - GDPR Art. 20",
      "Tienes derecho a recibir tus datos personales en un formato estructurado y machine-readable.",
      [
        {
          text: "Solicitar Datos",
          onPress: () => console.log("Iniciar proceso de portabilidad")
        },
        {
          text: "Cancelar",
          style: "cancel"
        }
      ]
    );
  };

  const handleOptOut = () => {
    Alert.alert(
      "Exclusión de Venta - CCPA/CPRA",
      "Puedes optar por no participar en la 'venta' o intercambio de tus datos personales.",
      [
        {
          text: "Excluir Mis Datos",
          onPress: () => {
            setPreferences(prev => ({
              ...prev,
              thirdParty: false,
              marketing: false
            }));
          }
        },
        {
          text: "Cancelar",
          style: "cancel"
        }
      ]
    );
  };

  return (
    <>
      <Modal transparent visible={visible} animationType="fade" onRequestClose={onRequestClose}>
        <Pressable style={privacyStyles.overlay} onPress={onRequestClose}>
          <Animated.View 
            style={[
              privacyStyles.animatedContainer, 
              { transform: [{ translateY: slideAnim }] }
            ]}
          >
            <Pressable style={privacyStyles.card} onPress={() => {}}>
              {/* Header */}
              <View style={privacyStyles.header}>
                <View style={privacyStyles.headerIcon}>
                  <Ionicons name="shield-checkmark" size={28} color="#0F172A" />
                </View>
                <Text style={privacyStyles.title}>Centro de Privacidad y Consentimiento</Text>
                <Text style={privacyStyles.subtitle}>
                  Cumplimiento GDPR & CCPA/CPRA • Controla tu privacidad
                </Text>
              </View>

              <ScrollView 
                style={privacyStyles.scrollContent} 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={privacyStyles.scrollContainer}
              >
                {/* Sección de Documentos Legales */}
                <View style={privacyStyles.section}>
                  <TouchableOpacity 
                    style={privacyStyles.sectionHeader}
                    onPress={() => toggleSection('legal')}
                  >
                    <View style={privacyStyles.sectionTitleRow}>
                      <Ionicons name="document-text" size={20} color="#0F172A" />
                      <Text style={privacyStyles.sectionTitle}>Documentos Legales</Text>
                    </View>
                    <Ionicons 
                      name={expandedSections.legal ? "chevron-up" : "chevron-down"} 
                      size={20} 
                      color="#6B7280" 
                    />
                  </TouchableOpacity>

                  {expandedSections.legal && (
                    <View style={privacyStyles.sectionContent}>
                      <TouchableOpacity 
                        style={privacyStyles.documentAll}
                        onPress={() => setDocumentsAccepted(!documentsAccepted)}
                      >
                        <View style={privacyStyles.documentCheckbox}>
                          <Ionicons 
                            name={documentsAccepted ? "checkbox" : "square-outline"} 
                            size={24} 
                            color={documentsAccepted ? "#0F172A" : "#9CA3AF"} 
                          />
                        </View>
                        <View style={privacyStyles.documentTextContainer}>
                          <Text style={privacyStyles.documentAllText}>
                            Acepto los términos y políticas
                          </Text>
                          <Text style={privacyStyles.documentAllSubtext}>
                            He leído y acepto los documentos legales
                          </Text>
                        </View>
                      </TouchableOpacity>

                      <View style={privacyStyles.documentsList}>
                        {[
                          { key: 'privacy' as keyof typeof POLICY_DATA, icon: 'lock-closed', label: 'Política de Privacidad', description: 'Cómo protegemos y usamos tus datos' },
                          { key: 'terms' as keyof typeof POLICY_DATA, icon: 'business', label: 'Términos de Servicio', description: 'Condiciones de uso de la plataforma' },
                          { key: 'cookies' as keyof typeof POLICY_DATA, icon: 'nutrition', label: 'Política de Cookies', description: 'Uso de cookies y tecnologías similares' },
                          { key: 'dataProcessing' as keyof typeof POLICY_DATA, icon: 'settings', label: 'Acuerdo de Procesamiento', description: 'Bases legales del tratamiento' }
                        ].map((doc) => (
                          <TouchableOpacity 
                            key={doc.key}
                            style={privacyStyles.documentLink}
                            onPress={() => openPolicyDetail(doc.key)}
                          >
                            <View style={privacyStyles.documentIcon}>
                              <Ionicons name={doc.icon as any} size={18} color="#0F172A" />
                            </View>
                            <View style={privacyStyles.documentInfo}>
                              <Text style={privacyStyles.documentLinkText}>{doc.label}</Text>
                              <Text style={privacyStyles.documentDescription}>{doc.description}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={16} color="#6B7280" />
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  )}
                </View>

                {/* Preferencias de Privacidad */}
                <View style={privacyStyles.section}>
                  <TouchableOpacity 
                    style={privacyStyles.sectionHeader}
                    onPress={() => toggleSection('preferences')}
                  >
                    <View style={privacyStyles.sectionTitleRow}>
                      <Ionicons name="options" size={20} color="#0F172A" />
                      <Text style={privacyStyles.sectionTitle}>Preferencias de Privacidad</Text>
                    </View>
                    <Ionicons 
                      name={expandedSections.preferences ? "chevron-up" : "chevron-down"} 
                      size={20} 
                      color="#6B7280" 
                    />
                  </TouchableOpacity>

                  {expandedSections.preferences && (
                    <View style={privacyStyles.sectionContent}>
                      {[
                        {
                          key: 'essential',
                          title: 'Procesamiento Esencial',
                          description: 'Datos necesarios para el funcionamiento básico del servicio',
                          required: true,
                          value: preferences.essential
                        },
                        {
                          key: 'dataProcessing',
                          title: 'Procesamiento de Datos',
                          description: 'Almacenamiento y gestión segura de tu información',
                          required: true,
                          value: preferences.dataProcessing
                        },
                        {
                          key: 'marketing',
                          title: 'Comunicaciones de Marketing',
                          description: 'Ofertas personalizadas, promociones y newsletters',
                          required: false,
                          value: preferences.marketing
                        },
                        {
                          key: 'analytics',
                          title: 'Análisis y Mejora',
                          description: 'Datos anónimos para mejorar nuestros servicios',
                          required: false,
                          value: preferences.analytics
                        },
                        {
                          key: 'thirdParty',
                          title: 'Compartir con Terceros',
                          description: 'Socios confiables para servicios específicos',
                          required: false,
                          value: preferences.thirdParty
                        }
                      ].map((item) => (
                        <View key={item.key} style={privacyStyles.preferenceItem}>
                          <View style={privacyStyles.preferenceInfo}>
                            <Text style={privacyStyles.preferenceTitle}>{item.title}</Text>
                            <Text style={privacyStyles.preferenceDescription}>
                              {item.description}
                            </Text>
                            {item.required && (
                              <View style={privacyStyles.requiredBadge}>
                                <Text style={privacyStyles.requiredText}>Requerido</Text>
                              </View>
                            )}
                          </View>
                          {!item.required ? (
                            <Switch
                              value={item.value}
                              onValueChange={(value) => updatePreference(item.key as keyof PrivacyPreferences, value)}
                              trackColor={{ false: "#E5E7EB", true: "#0F172A" }}
                              thumbColor="#FFFFFF"
                            />
                          ) : (
                            <Ionicons name="lock-closed" size={20} color="#6B7280" />
                          )}
                        </View>
                      ))}
                    </View>
                  )}
                </View>

                {/* Derechos del Usuario */}
                <View style={privacyStyles.section}>
                  <TouchableOpacity 
                    style={privacyStyles.sectionHeader}
                    onPress={() => toggleSection('rights')}
                  >
                    <View style={privacyStyles.sectionTitleRow}>
                      <Ionicons name="shield-half" size={20} color="#0F172A" />
                      <Text style={privacyStyles.sectionTitle}>Tus Derechos de Privacidad</Text>
                    </View>
                    <Ionicons 
                      name={expandedSections.rights ? "chevron-up" : "chevron-down"} 
                      size={20} 
                      color="#6B7280" 
                    />
                  </TouchableOpacity>

                  {expandedSections.rights && (
                    <View style={privacyStyles.sectionContent}>
                      <View style={privacyStyles.rightsGrid}>
                        <TouchableOpacity 
                          style={privacyStyles.rightItem}
                          onPress={handleDataPortability}
                        >
                          <View style={privacyStyles.rightIcon}>
                            <Ionicons name="download" size={20} color="#0F172A" />
                          </View>
                          <Text style={privacyStyles.rightTitle}>Portabilidad</Text>
                          <Text style={privacyStyles.rightDescription}>
                            Obtener tus datos en formato reutilizable
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                          style={privacyStyles.rightItem}
                          onPress={handleRightToBeForgotten}
                        >
                          <View style={privacyStyles.rightIcon}>
                            <Ionicons name="trash-outline" size={20} color="#0F172A" />
                          </View>
                          <Text style={privacyStyles.rightTitle}>Al Olvido</Text>
                          <Text style={privacyStyles.rightDescription}>
                            Eliminar tus datos personales
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                          style={privacyStyles.rightItem}
                          onPress={handleOptOut}
                        >
                          <View style={privacyStyles.rightIcon}>
                            <Ionicons name="eye-off" size={20} color="#0F172A" />
                          </View>
                          <Text style={privacyStyles.rightTitle}>Exclusión</Text>
                          <Text style={privacyStyles.rightDescription}>
                            Optar por no vender datos (CCPA)
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                          style={privacyStyles.rightItem}
                          onPress={() => openPolicyDetail('privacy')}
                        >
                          <View style={privacyStyles.rightIcon}>
                            <Ionicons name="information" size={20} color="#0F172A" />
                          </View>
                          <Text style={privacyStyles.rightTitle}>Información</Text>
                          <Text style={privacyStyles.rightDescription}>
                            Saber qué datos tenemos
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>

                {/* Cumplimiento Normativo */}
                <View style={privacyStyles.section}>
                  <TouchableOpacity 
                    style={privacyStyles.sectionHeader}
                    onPress={() => toggleSection('compliance')}
                  >
                    <View style={privacyStyles.sectionTitleRow}>
                      <Ionicons name="ribbon" size={20} color="#0F172A" />
                      <Text style={privacyStyles.sectionTitle}>Cumplimiento Normativo</Text>
                    </View>
                    <Ionicons 
                      name={expandedSections.compliance ? "chevron-up" : "chevron-down"} 
                      size={20} 
                      color="#6B7280" 
                    />
                  </TouchableOpacity>

                  {expandedSections.compliance && (
                    <View style={privacyStyles.sectionContent}>
                      <View style={privacyStyles.complianceSection}>
                        <View style={privacyStyles.complianceBadge}>
                          <Ionicons name="shield-checkmark" size={20} color="#059669" />
                          <Text style={privacyStyles.complianceText}>Cumplimiento Verificado</Text>
                        </View>
                        
                        <View style={privacyStyles.complianceGrid}>
                          <View style={privacyStyles.complianceItem}>
                            <Ionicons name="globe" size={16} color="#0F172A" />
                            <Text style={privacyStyles.complianceItemText}>GDPR</Text>
                            <Text style={privacyStyles.complianceItemSubtext}>UE/EEE</Text>
                          </View>
                          <View style={privacyStyles.complianceItem}>
                            <Ionicons name="location" size={16} color="#0F172A" />
                            <Text style={privacyStyles.complianceItemText}>CCPA/CPRA</Text>
                            <Text style={privacyStyles.complianceItemSubtext}>California</Text>
                          </View>
                          <View style={privacyStyles.complianceItem}>
                            <Ionicons name="lock-closed" size={16} color="#0F172A" />
                            <Text style={privacyStyles.complianceItemText}>LGPD</Text>
                            <Text style={privacyStyles.complianceItemSubtext}>Brasil</Text>
                          </View>
                        </View>

                        <View style={privacyStyles.complianceInfo}>
                          <Text style={privacyStyles.complianceInfoText}>
                            • Consentimiento explícito registrado
                          </Text>
                          <Text style={privacyStyles.complianceInfoText}>
                            • Base legal: Art. 6(1)(a) GDPR
                          </Text>
                          <Text style={privacyStyles.complianceInfoText}>
                            • Registros de procesamiento mantenidos
                          </Text>
                          <Text style={privacyStyles.complianceInfoText}>
                            • Mecanismos de exclusión implementados
                          </Text>
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              </ScrollView>

              {/* Footer */}
              <View style={privacyStyles.footer}>
                <TouchableOpacity 
                  style={privacyStyles.rejectButton}
                  onPress={onReject}
                >
                  <Text style={privacyStyles.rejectText}>Rechazar</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[
                    privacyStyles.acceptButton, 
                    !documentsAccepted && privacyStyles.acceptButtonDisabled
                  ]}
                  onPress={handleAccept}
                  disabled={!documentsAccepted}
                >
                  <Text style={privacyStyles.acceptText}>
                    {documentsAccepted ? "Aceptar y Continuar" : "Aceptar Documentos"}
                  </Text>
                  <Text style={privacyStyles.acceptSubtext}>
                    Consentimiento explícito • GDPR Art. 7
                  </Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>

      {/* Modal de Detalle de Políticas */}
      {selectedPolicy && (
        <PolicyDetailModal
          visible={selectedPolicy !== null}
          policyType={selectedPolicy}
          onClose={() => setSelectedPolicy(null)}
        />
      )}
    </>
  );
}

// Componente principal
export default function ProfileSetupScreen() {
  const params = useLocalSearchParams<{ name?: string; email?: string; password?: string; otpCode?: string }>();
  const [nick, setNick] = useState("");
  const [dob, setDob] = useState<Date | null>(null);
  const [showDate, setShowDate] = useState(false);
  const [gender, setGender] = useState<string>("");
  const [genderOpen, setGenderOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  // Estados para cumplimiento normativo
  const [privacyModalVisible, setPrivacyModalVisible] = useState(false);
  const [privacyPreferences, setPrivacyPreferences] = useState<PrivacyPreferences>({
    marketing: false,
    analytics: true,
    thirdParty: false,
    dataProcessing: true,
    essential: true,
  });

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permiso requerido",
        "Necesitamos acceso a tu galería para seleccionar una foto de perfil.",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Abrir Configuración", onPress: () => Linking.openURL('app-settings:') }
        ]
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const handlePrivacyAccept = (preferences: PrivacyPreferences, compliance: ComplianceData) => {
    setPrivacyModalVisible(false);
    processRegistration(compliance);
  };

  const handlePrivacyReject = () => {
    Alert.alert(
      "Consentimiento Requerido",
      "Para crear una cuenta y cumplir con las regulaciones de protección de datos (GDPR, CCPA/CPRA), necesitamos tu consentimiento para el procesamiento básico de datos.",
      [
        {
          text: "Ver Detalles",
          onPress: () => Linking.openURL('https://tu-dominio.com/privacy')
        },
        {
          text: "Reconsiderar",
          style: "default",
          onPress: () => setPrivacyModalVisible(true)
        },
        {
          text: "Cancelar",
          style: "cancel"
        }
      ]
    );
  };

  const processRegistration = async (compliance: ComplianceData) => {
    if (!params.name || !params.email || !params.password) {
      setErrorMsg("Faltan datos requeridos del primer paso.");
      setErrorOpen(true);
      return;
    }
    if (!nick) {
      setErrorMsg("Por favor, ingresa tu apodo.");
      setErrorOpen(true);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: String(params.name),
        username: nick,
        email: String(params.email),
        password: String(params.password),
        dateOfBirth: dob ? dob.toISOString().slice(0, 10) : undefined,
        gender: (gender || undefined) as any,
        complianceData: compliance,
        privacyPreferences: privacyPreferences,
      };
      
      console.log('📝 Enviando registro con payload:', payload);
      await register(payload);
      console.log('✅ Registro exitoso');

      setSuccessOpen(true);
    } catch (e: any) {
      const msg =
        e?.message ||
        "Ocurrió un problema al registrar tu cuenta. Inténtalo de nuevo.";
      setErrorMsg(msg);
      setErrorOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const onSave = async () => {
    if (!nick.trim()) {
      setErrorMsg("Por favor, ingresa un apodo válido.");
      setErrorOpen(true);
      return;
    }
    
    setPrivacyModalVisible(true);
  };

  const handleDataPortability = () => {
    Alert.alert(
      "Portabilidad de Datos",
      "Puedes solicitar una copia de tus datos en cualquier momento desde Configuración → Privacidad.",
      [{ text: "Entendido" }]
    );
  };

  const handleRightToBeForgotten = () => {
    Alert.alert(
      "Derecho al Olvido",
      "Puedes solicitar la eliminación de tus datos desde Configuración → Privacidad → Eliminar cuenta.",
      [{ text: "Entendido" }]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => router.back()}
            hitSlop={{ top: 12, right: 12, bottom: 12, left: 12 }}
          >
            <Ionicons name="chevron-back" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Completa tu perfil</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          bounces={false}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.avatarBox}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarCircle}>
                <Ionicons name="person" size={54} color="#CBD5E1" />
              </View>
            )}
            <TouchableOpacity style={styles.editBadge} activeOpacity={0.9} onPress={pickImage}>
              <Ionicons name="create-outline" size={16} color="#ffffff" />
            </TouchableOpacity>
          </View>

          <View style={styles.stack16}>
            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="Apodo"
                placeholderTextColor="#9AA3AF"
                value={nick}
                onChangeText={setNick}
                style={styles.input}
                maxLength={30}
              />
            </View>

            <TouchableOpacity
              style={styles.inputWrapper}
              onPress={() => setShowDate(true)}
              activeOpacity={0.9}
            >
              <Ionicons
                name="calendar-clear-outline"
                size={18}
                color="#9AA3AF"
                style={styles.leftIcon}
              />
              <View pointerEvents="none">
                <TextInput
                  placeholder="Fecha de nacimiento"
                  placeholderTextColor="#9AA3AF"
                  value={dob ? new Date(dob).toLocaleDateString() : ""}
                  style={[styles.input, styles.inputWithIcon]}
                  editable={false}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.inputWrapper}
              onPress={() => setGenderOpen(true)}
              activeOpacity={0.9}
            >
              <View pointerEvents="none">
                <TextInput
                  placeholder="Género"
                  placeholderTextColor="#9AA3AF"
                  value={gender}
                  style={styles.input}
                  editable={false}
                />
              </View>
              <Ionicons name="chevron-down" size={18} color="#9AA3AF" style={styles.rightIcon} />
            </TouchableOpacity>

            {/* Sección de Cumplimiento Normativo */}
            <View style={complianceStyles.section}>
              <View style={complianceStyles.sectionHeader}>
                <Ionicons name="shield-checkmark" size={20} color="#0F172A" />
                <Text style={complianceStyles.sectionTitle}>Protección de Datos</Text>
              </View>
              
              <View style={complianceStyles.features}>
                <View style={complianceStyles.feature}>
                  <Ionicons name="lock-closed" size={16} color="#059669" />
                  <Text style={complianceStyles.featureText}>Cifrado de datos</Text>
                </View>
                <View style={complianceStyles.feature}>
                  <Ionicons name="eye-off" size={16} color="#059669" />
                  <Text style={complianceStyles.featureText}>Control de privacidad</Text>
                </View>
                <View style={complianceStyles.feature}>
                  <Ionicons name="document-text" size={16} color="#059669" />
                  <Text style={complianceStyles.featureText}>Cumplimiento GDPR</Text>
                </View>
              </View>

              <View style={complianceStyles.rightsSection}>
                <TouchableOpacity style={complianceStyles.rightItem} onPress={handleDataPortability}>
                  <Ionicons name="download" size={18} color="#0F172A" />
                  <Text style={complianceStyles.rightText}>Portabilidad de datos</Text>
                </TouchableOpacity>

                <TouchableOpacity style={complianceStyles.rightItem} onPress={handleRightToBeForgotten}>
                  <Ionicons name="trash-outline" size={18} color="#0F172A" />
                  <Text style={complianceStyles.rightText}>Derecho al olvido</Text>
                </TouchableOpacity>
              </View>

              <View style={complianceStyles.legalNotice}>
                <Text style={complianceStyles.legalText}>
                  Al continuar, aceptas nuestro{' '}
                  <Text 
                    style={complianceStyles.legalLink}
                    onPress={() => Linking.openURL('https://tu-dominio.com/privacy')}
                  >
                    Procesamiento de Datos
                  </Text>{' '}
                  según el RGPD y CCPA/CPRA.
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
              onPress={onSave}
              activeOpacity={0.85}
              disabled={loading}
            >
              <Text style={styles.primaryBtnText}>
                {loading ? "Procesando..." : "Continuar con Consentimiento"}
              </Text>
            </TouchableOpacity>

            <Text style={complianceStyles.securityNote}>
              <Ionicons name="lock-closed" size={12} color="#6B7280" />
              {' '}Tus datos están protegidos y encriptados
            </Text>
          </View>
        </ScrollView>

        {showDate && (
          <DateTimePicker
            value={dob || new Date(2000, 0, 1)}
            mode="date"
            display={Platform.OS === "ios" ? "inline" : "calendar"}
            onChange={(_, selected) => {
              setShowDate(false);
              if (selected) setDob(selected);
            }}
            maximumDate={new Date()}
          />
        )}

        <Modal
          visible={genderOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setGenderOpen(false)}
        >
          <Pressable style={styles.modalBackdrop} onPress={() => setGenderOpen(false)}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Selecciona tu género</Text>
              <View style={styles.modalList}>
                {["Hombre", "Mujer", "Prefiero no decirlo", "Otro"].map((opt) => (
                  <TouchableOpacity
                    key={opt}
                    style={styles.modalItem}
                    onPress={() => {
                      setGender(opt);
                      setGenderOpen(false);
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.modalItemText}>{opt}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setGenderOpen(false)}>
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Modal>

        {/* Modal de Consentimiento de Privacidad */}
        <PrivacyConsentModal
          visible={privacyModalVisible}
          onAccept={handlePrivacyAccept}
          onReject={handlePrivacyReject}
          onRequestClose={() => setPrivacyModalVisible(false)}
          onPreferencesChange={setPrivacyPreferences}
          initialPreferences={privacyPreferences}
        />

        <ResultModal
          visible={successOpen}
          type="success"
          title="¡Cuenta Creada Exitosamente!"
          subtitle={`Tu registro para ${params.email ?? ""} se completó con todos los estándares de seguridad y privacidad.`}
          primaryLabel="Comenzar"
          onPrimary={() => {
            setSuccessOpen(false);
            router.replace("/login");
          }}
          onRequestClose={() => setSuccessOpen(false)}
        />

        <ResultModal
          visible={errorOpen}
          type="error"
          title="No se pudo completar el registro"
          subtitle={errorMsg}
          primaryLabel="Entendido"
          onPrimary={() => setErrorOpen(false)}
          onRequestClose={() => setErrorOpen(false)}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Estilos
const COLORS = {
  bg: "#FFFFFF",
  textDark: "#111827",
  textMid: "#6B7280",
  inputBg: "#F3F4F6",
  inputBorder: "#E5E7EB",
  primary: "#0F172A",
  success: "#059669",
  error: "#DC2626",
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  flex: { flex: 1 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 6,
  },
  headerTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: 18,
    color: COLORS.textDark,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 24,
    gap: 20,
  },
  avatarBox: {
    alignSelf: "center",
    width: 140,
    height: 140,
    marginTop: 6,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarCircle: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: {
    width: 128,
    height: 128,
    borderRadius: 64,
  },
  editBadge: {
    position: "absolute",
    right: 6,
    bottom: 6,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  stack16: {
    display: "flex",
    gap: 16,
  },
  inputWrapper: { position: "relative" },
  input: {
    height: 50,
    borderRadius: 12,
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    paddingHorizontal: 14,
    fontFamily: "Poppins_400Regular",
    color: COLORS.textDark,
    fontSize: 14,
  },
  inputWithIcon: { paddingLeft: 42 },
  leftIcon: { position: "absolute", left: 14, top: 16 },
  rightIcon: { position: "absolute", right: 14, top: 16 },
  primaryBtn: {
    height: 54,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  primaryBtnDisabled: {
    opacity: 0.6,
  },
  primaryBtnText: {
    color: "#FFFFFF",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: "#fff",
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    gap: 12,
  },
  modalTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: 16,
    color: COLORS.textDark,
  },
  modalList: { gap: 6 },
  modalItem: {
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  modalItemText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: COLORS.textDark,
  },
  modalCancel: { alignSelf: "center", paddingVertical: 10, paddingHorizontal: 16 },
  modalCancelText: { fontFamily: "Poppins_600SemiBold", color: COLORS.textMid, fontSize: 14 },
});

const m = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(17,24,39,0.45)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  card: {
    width: "100%",
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 22,
    paddingVertical: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  title: {
    fontFamily: "Poppins_700Bold",
    fontSize: 18,
    color: "#111827",
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 20,
  },
  primaryBtn: {
    width: "70%",
    height: 46,
    borderRadius: 14,
    backgroundColor: "#0F172A",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  primaryText: {
    color: "#fff",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 15,
  },
});

const privacyStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(17,24,39,0.65)",
    justifyContent: 'flex-end',
  },
  animatedContainer: {
    width: '100%',
    maxHeight: '90%',
  },
  card: {
    width: "100%",
    maxHeight: "90%",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
  },
  header: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  headerIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  title: {
    fontFamily: "Poppins_700Bold",
    fontSize: SCREEN_WIDTH < 375 ? 18 : 20,
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: "Poppins_400Regular",
    fontSize: SCREEN_WIDTH < 375 ? 12 : 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  section: {
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "#F8FAFC",
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  sectionTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    color: "#111827",
  },
  sectionContent: {
    padding: 16,
  },
  documentAll: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 12,
    marginBottom: 16,
  },
  documentCheckbox: {
    marginRight: 12,
    marginTop: 2,
  },
  documentTextContainer: {
    flex: 1,
  },
  documentAllText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    color: "#111827",
    marginBottom: 4,
  },
  documentAllSubtext: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    color: "#6B7280",
  },
  documentsList: {
    gap: 12,
  },
  documentLink: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    gap: 12,
  },
  documentIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  documentInfo: {
    flex: 1,
  },
  documentLinkText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    color: "#374151",
    marginBottom: 2,
  },
  documentDescription: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    color: "#6B7280",
  },
  preferenceItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  preferenceInfo: {
    flex: 1,
    marginRight: 16,
  },
  preferenceTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    color: "#111827",
    marginBottom: 4,
  },
  preferenceDescription: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 16,
    marginBottom: 8,
  },
  requiredBadge: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  requiredText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 10,
    color: "#6B7280",
  },
  rightsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  rightItem: {
    width: (SCREEN_WIDTH - 80) / 2 - 6,
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  rightIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  rightTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    color: "#111827",
    marginBottom: 4,
    textAlign: 'center',
  },
  rightDescription: {
    fontFamily: "Poppins_400Regular",
    fontSize: 11,
    color: "#6B7280",
    textAlign: 'center',
    lineHeight: 14,
  },
  complianceSection: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 16,
  },
  complianceBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 16,
  },
  complianceText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    color: "#059669",
  },
  complianceGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  complianceItem: {
    alignItems: "center",
    flex: 1,
  },
  complianceItemText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 12,
    color: "#374151",
    marginTop: 4,
  },
  complianceItemSubtext: {
    fontFamily: "Poppins_400Regular",
    fontSize: 10,
    color: "#6B7280",
  },
  complianceInfo: {
    gap: 6,
  },
  complianceInfoText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    color: "#374151",
  },
  footer: {
    flexDirection: "row",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    gap: 12,
  },
  rejectButton: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  rejectText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    color: "#6B7280",
  },
  acceptButton: {
    flex: 2,
    height: 56,
    borderRadius: 12,
    backgroundColor: "#0F172A",
    alignItems: "center",
    justifyContent: "center",
  },
  acceptButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  acceptText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    color: "#FFFFFF",
    marginBottom: 2,
  },
  acceptSubtext: {
    fontFamily: "Poppins_400Regular",
    fontSize: 10,
    color: "#D1D5DB",
  },
});

const complianceStyles = StyleSheet.create({
  section: {
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    color: "#111827",
  },
  features: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    flexWrap: 'wrap',
    gap: 8,
  },
  feature: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    minWidth: '30%',
  },
  featureText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    color: "#059669",
  },
  rightsSection: {
    gap: 8,
    marginBottom: 16,
  },
  rightItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  rightText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: "#374151",
    flex: 1,
  },
  legalNotice: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  legalText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 16,
    textAlign: "center",
  },
  legalLink: {
    color: "#0F172A",
    textDecorationLine: "underline",
  },
  securityNote: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 8,
  },
});

const policyStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(17,24,39,0.75)",
    justifyContent: 'flex-end',
  },
  animatedContainer: {
    width: '100%',
    maxHeight: '95%',
  },
  card: {
    width: "100%",
    maxHeight: "95%",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    alignItems: "center",
    paddingVertical: 28,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    backgroundColor: "#F8FAFC",
  },
  headerIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontFamily: "Poppins_700Bold",
    fontSize: SCREEN_WIDTH < 375 ? 20 : 24,
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: "Poppins_400Regular",
    fontSize: SCREEN_WIDTH < 375 ? 13 : 15,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  section: {
    marginBottom: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 20,
    backgroundColor: "#F8FAFC",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    color: "#111827",
    flex: 1,
  },
  sectionContent: {
    padding: 20,
  },
  item: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  bullet: {
    width: 20,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 4,
    marginRight: 8,
  },
  itemText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
    flex: 1,
  },
  infoSection: {
    backgroundColor: "#EFF6FF",
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    color: "#1E40AF",
    marginLeft: 8,
  },
  infoContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
  },
  infoText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    color: "#374151",
    lineHeight: 18,
  },
  footer: {
    flexDirection: "row",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    gap: 12,
    backgroundColor: "#F8FAFC",
  },
  closeButton: {
    flex: 1,
    height: 54,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  closeText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    color: "#6B7280",
  },
  acceptButton: {
    flex: 2,
    height: 54,
    borderRadius: 12,
    backgroundColor: "#0F172A",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  acceptText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    color: "#FFFFFF",
  },
});