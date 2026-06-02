import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { LegalScreen } from '../../src/components/LegalScreen';
import { colors } from '../../src/theme/colors';

export default function PrivacyScreen() {
  return (
    <LegalScreen title="Privacidad">
      <Text style={styles.h1}>Política de Privacidad</Text>
      <Text style={styles.date}>Última actualización: Junio 2026</Text>

      <Text style={styles.h2}>Información que recopilamos</Text>
      <Text style={styles.p}>
        Scout está diseñado para funcionar con privacidad por defecto. No recopilamos, almacenamos ni
        transmitimos imágenes de tu cámara a ningún servidor. Todo el procesamiento de imágenes ocurre
        localmente en tu dispositivo.
      </Text>
      <Text style={styles.p}>
        Podemos recopilar información de uso anónima (como frecuencia de escaneos, funciones utilizadas)
        únicamente si has activado la opción "Compartir análisis" en Ajustes &gt; Privacidad.
      </Text>

      <Text style={styles.h2}>Cámara</Text>
      <Text style={styles.p}>
        Scout requiere acceso a la cámara para funcionar. Las imágenes de la cámara se procesan en tiempo
        real y NO se almacenan, guardan ni envían a ningún servidor externo. Puedes revocar el permiso de
        cámara en cualquier momento desde los ajustes del sistema.
      </Text>

      <Text style={styles.h2}>Ubicación</Text>
      <Text style={styles.p}>
        La ubicación se utiliza únicamente para mostrar mapas de riesgo de garrapatas en tu área. Los datos
        de ubicación no se almacenan permanentemente ni se comparten con terceros. La ubicación es opcional
        y puedes desactivarla en cualquier momento.
      </Text>

      <Text style={styles.h2}>Notificaciones</Text>
      <Text style={styles.p}>
        Las notificaciones push se utilizan para recordatorios de revisión, alertas de riesgo y consejos.
        Puedes gestionar las notificaciones desde Ajustes &gt; Notificaciones o desde los ajustes del sistema.
      </Text>

      <Text style={styles.h2}>Datos locales</Text>
      <Text style={styles.p}>
        Tu historial de escaneos, fotos de comparación y preferencias se almacenan exclusivamente en tu
        dispositivo. Puedes eliminar todos los datos locales en cualquier momento desde Ajustes &gt; Datos.
      </Text>

      <Text style={styles.h2}>Servicios de terceros</Text>
      <Text style={styles.p}>
        Scout no utiliza servicios de terceros que recopilen datos personales. No incluimos analíticas de
        terceros, redes publicitarias ni SDKs de seguimiento.
      </Text>

      <Text style={styles.h2}>Tus derechos</Text>
      <Text style={styles.p}>
        Tienes derecho a: acceder a tus datos, solicitar la eliminación de tus datos, revocar permisos en
        cualquier momento, y exportar tus datos locales. Para ejercer estos derechos, contáctanos en
        scout@uyobonus.com.
      </Text>

      <Text style={styles.h2}>Cambios</Text>
      <Text style={styles.p}>
        Podemos actualizar esta política de privacidad ocasionalmente. Notificaremos cambios significativos
        a través de la aplicación o por correo electrónico si está registrado.
      </Text>
    </LegalScreen>
  );
}

const styles = StyleSheet.create({
  h1: { color: colors.primary, fontSize: 20, fontWeight: '700', marginBottom: 4, lineHeight: 28 },
  date: { color: colors.textTertiary, fontSize: 11, marginBottom: 16 },
  h2: { color: colors.text, fontSize: 15, fontWeight: '600', marginTop: 20, marginBottom: 6 },
  p: { color: colors.textSecondary, fontSize: 13, lineHeight: 20, marginBottom: 4 },
});
