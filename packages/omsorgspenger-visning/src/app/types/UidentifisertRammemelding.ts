enum UidentifisertRammemeldingType {
  AUTOMATISK,
  UTVIDET_RETT
}

export default interface UidentifisertRammemelding {
  type: UidentifisertRammemeldingType;
}