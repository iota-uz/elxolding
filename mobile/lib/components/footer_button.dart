import 'package:flutter/material.dart';

class FooterButton extends StatelessWidget {
  final String text;
  final void Function() onPressed;
  final bool secondary;

  const FooterButton({
    super.key,
    required this.text,
    required this.onPressed,
    this.secondary = false,
  });

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: onPressed,
      style: ElevatedButton.styleFrom(
        padding: const EdgeInsets.symmetric(vertical: 15),
        backgroundColor:
            secondary ? Colors.white : Theme.of(context).primaryColor,
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
