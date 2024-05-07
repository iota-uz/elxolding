import 'package:flutter/material.dart';

class FooterButton extends StatelessWidget {
  final String text;
  final void Function() onPressed;
  final bool secondary;
  final bool disabled;

  const FooterButton({
    super.key,
    required this.text,
    required this.onPressed,
    this.secondary = false,
    this.disabled = false,
  });

  Color bgColor(BuildContext context) {
    if (secondary) {
      return Colors.white;
    }
    if (disabled) {
      return Colors.grey;
    }
    return Theme.of(context).primaryColor;
  }

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: disabled ? null : onPressed,
      style: ElevatedButton.styleFrom(
        padding: const EdgeInsets.symmetric(vertical: 15),
        backgroundColor: bgColor(context),
        minimumSize: const Size.fromHeight(36),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(80),
        ),
        elevation: 0,
      ),
      child: Text(
        text,
        style: TextStyle(
          color: secondary ? Theme.of(context).primaryColor : Colors.white,
          fontSize: 18,
        ),
      ),
    );
  }
}
