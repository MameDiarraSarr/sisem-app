import jsPDF from 'jspdf';
import { robotoBase64 } from './roboto-base64';

// Enregistre la police Roboto (avec accents) dans une instance jsPDF
export function enregistrerPolice(doc: jsPDF): void {
  doc.addFileToVFS('Roboto-Regular.ttf', robotoBase64);
  doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
  doc.addFont('Roboto-Regular.ttf', 'Roboto', 'bold');
}