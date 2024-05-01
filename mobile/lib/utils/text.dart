
// function for russian decline, w1, w1, w3, n

String decline(int n, String w1, String w2, String w3) {
  if (n % 10 == 1 && n % 100 != 11) {
    return w1;
  } else if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) {
    return w2;
  } else {
    return w3;
  }
}
