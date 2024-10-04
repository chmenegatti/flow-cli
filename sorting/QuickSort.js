class QuickSort {
  static compare(a, b) {
    const isErrorA = a["this"].includes("error");
    const isErrorB = b["this"].includes("error");

    if (isErrorA && !isErrorB) return 1;
    if (!isErrorA && isErrorB) return -1;

    const versionA = a["this"].replace(/[^\d.]/g, '').split('.').map(Number);
    const versionB = b["this"].replace(/[^\d.]/g, '').split('.').map(Number);

    for (let i = 0; i < Math.max(versionA.length, versionB.length); i++) {
      const diff = (versionA[i] || 0) - (versionB[i] || 0);
      if (diff !== 0) {
        return diff;
      }
    }
    return 0;
  }
}

module.exports = QuickSort;
