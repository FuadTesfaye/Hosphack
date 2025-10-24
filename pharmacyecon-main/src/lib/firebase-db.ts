import { db } from './firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, getDoc } from 'firebase/firestore';
import type { Pharmacy, Medicine, LicenseRequest } from './types';
import bcrypt from 'bcryptjs';

// Pharmacy operations
export async function addPharmacyToFirebase(data: Omit<Pharmacy, 'id'>): Promise<string> {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const pharmacyData = {
    ...data,
    password: hashedPassword,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  const docRef = await addDoc(collection(db, 'pharmacies'), pharmacyData);
  return docRef.id;
}

export async function getPharmaciesFromFirebase(): Promise<Pharmacy[]> {
  const querySnapshot = await getDocs(collection(db, 'pharmacies'));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Pharmacy));
}

export async function getPharmacyByEmail(email: string): Promise<Pharmacy | null> {
  const q = query(collection(db, 'pharmacies'), where('email', '==', email));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    return null;
  }
  
  const doc = querySnapshot.docs[0];
  return {
    id: doc.id,
    ...doc.data()
  } as Pharmacy;
}

export async function updatePharmacyInFirebase(id: string, data: Partial<Pharmacy>): Promise<void> {
  const pharmacyRef = doc(db, 'pharmacies', id);
  await updateDoc(pharmacyRef, {
    ...data,
    updatedAt: new Date()
  });
}

export async function deletePharmacyFromFirebase(id: string): Promise<void> {
  await deleteDoc(doc(db, 'pharmacies', id));
}

// Medicine operations
export async function addMedicineToFirebase(data: Omit<Medicine, 'id'>): Promise<string> {
  const medicineData = {
    ...data,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  const docRef = await addDoc(collection(db, 'medicines'), medicineData);
  return docRef.id;
}

export async function getMedicinesFromFirebase(): Promise<Medicine[]> {
  const querySnapshot = await getDocs(collection(db, 'medicines'));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Medicine));
}

export async function getMedicinesByPharmacy(pharmacyId: string): Promise<Medicine[]> {
  const q = query(collection(db, 'medicines'), where('pharmacyId', '==', pharmacyId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Medicine));
}

export async function updateMedicineInFirebase(id: string, data: Partial<Medicine>): Promise<void> {
  const medicineRef = doc(db, 'medicines', id);
  await updateDoc(medicineRef, {
    ...data,
    updatedAt: new Date()
  });
}

export async function deleteMedicineFromFirebase(id: string): Promise<void> {
  await deleteDoc(doc(db, 'medicines', id));
}

// License Request operations
export async function addLicenseRequest(data: Omit<LicenseRequest, 'id'>): Promise<string> {
  const requestData = {
    ...data,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  const docRef = await addDoc(collection(db, 'licenseRequests'), requestData);
  return docRef.id;
}

export async function getLicenseRequestsByPharmacy(pharmacyId: string): Promise<LicenseRequest[]> {
  let q;
  if (pharmacyId === 'all') {
    q = query(collection(db, 'licenseRequests'));
  } else {
    q = query(collection(db, 'licenseRequests'), where('pharmacyId', '==', pharmacyId));
  }
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate() || new Date()
  } as LicenseRequest));
}

export async function getLicenseRequestsByCustomer(customerEmail: string, medicineId: string): Promise<LicenseRequest[]> {
  const q = query(
    collection(db, 'licenseRequests'), 
    where('customerEmail', '==', customerEmail),
    where('medicineId', '==', medicineId)
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate() || new Date()
  } as LicenseRequest));
}

export async function updateLicenseRequestStatus(id: string, status: 'approved' | 'rejected'): Promise<void> {
  const requestRef = doc(db, 'licenseRequests', id);
  await updateDoc(requestRef, {
    status,
    updatedAt: new Date()
  });
}