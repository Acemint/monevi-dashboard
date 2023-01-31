import { MoneviDateFormatter } from '@/api/methods/monevi-date-formatter';

export function getHistoryMessage(
  role: string,
  status: string,
  periodDateEpoch: any,
  userName: string,
  organiazationName: string
): any {
  var period = MoneviDateFormatter.formatDateDMYToMonthAndYear(MoneviDateFormatter.formatDate(periodDateEpoch));
  if (role == 'ROLE_TREASURER') {
    return getHistoryMessageForTreasurer(status, period);
  } else if (role == 'ROLE_CHAIRMAN') {
    return getHistoryMessageForChairman(status, period);
  } else if (role == 'ROLE_SUPERVISOR') {
    return getHistoryMessageForSupervisor(status, period, userName, organiazationName);
  }
}

function getHistoryMessageForTreasurer(status: string, period: string) {
  if (status == 'DECLINED') {
    return `Laporan untuk bulan ${period} telah ditolak`;
  } else if (status == 'UNAPPROVED') {
    return `Laporan untuk bulan ${period} telah dikirim ke ketua`;
  } else if (status == 'APPROVED_BY_CHAIRMAN') {
    return `Laporan untuk bulan ${period} sudah disetujui oleh ketua, menunggu persetujuan pengawas`;
  } else if (status == 'APPROVED_BY_SUPERVISOR') {
    return `Laporan untuk bulan ${period} sudah disetujui oleh pengawas`;
  }
}

function getHistoryMessageForChairman(status: string, period: string) {
  if (status == 'UNAPPROVED') {
    return `Laporan untuk bulan ${period} menunggu persetujuanmu`;
  } else if (status == 'DECLINED') {
    return `Laporan untuk bulan ${period} telah ditolak`;
  } else if (status == 'APPROVED_BY_CHAIRMAN') {
    return `Laporan untuk bulan ${period} telah dikirim ke pengawas`;
  } else if (status == 'APPROVED_BY_SUPERVISOR') {
    return `Laporan untuk bulan ${period} sudah disetujui oleh pengawas`;
  }
}

function getHistoryMessageForSupervisor(status: string, period: string, userName: string, organiazationName: string) {
  if (status == 'APPROVED_BY_CHAIRMAN') {
    return `Laporan untuk bulan ${period} menunggu persetujuanmu`;
  } else if (status == 'APPROVED_BY_SUPERVISOR') {
    return `Laporan untuk bulan ${period} telah disetujui oleh ${userName} [${organiazationName}]`;
  } else if (status == 'DECLINED') {
    return `Laporan untuk bulan ${period} telah ditolak oleh ${userName} [${organiazationName}]`;
  }
}
