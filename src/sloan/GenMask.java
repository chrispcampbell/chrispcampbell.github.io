import java.awt.*;
import java.awt.image.*;
import java.io.*;
import javax.imageio.*;

public class GenMask {

    private static void mask(String inputName, int size, String suffix) throws Exception {
        BufferedImage src = ImageIO.read(new File("orig", inputName + ".jpg"));
        Image scaled = src.getScaledInstance(size, size, Image.SCALE_AREA_AVERAGING);

        BufferedImage dst = new BufferedImage(size, size, BufferedImage.TYPE_INT_ARGB);
        Graphics2D g2 = dst.createGraphics();
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        g2.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
        g2.setColor(Color.WHITE);
        g2.fillOval(0, 0, size, size);
        g2.setComposite(AlphaComposite.SrcAtop);
        g2.drawImage(scaled, 0, 0, null);

        ImageIO.write(dst, "png", new File("sc", inputName + suffix + ".png"));
    }

    private static void mask(String[] inputNames, int size) throws Exception { 
        for (String inputName : inputNames) {
            mask(inputName, size, "");
            mask(inputName, size * 2, "-2x");
        }
    }

    public static void main(String[] args) throws Exception {
        String[] coverNames = new String[] {
            "peppermint",
            "smeared",
            "twice",
            "onechord",
            "navy",
            "between",
            "pretty",
            "action",
            "never",
            "parallel",
            "hit",
            "double",
            "commonwealth",
            "twelve",
            "steady",
            "bsides",
            "twiceout",
            "onechordout"
        };
        mask(coverNames, 45);

        String[] personNames = new String[] {
            "andrew",
            "chris",
            "jay",
            "patrick"
        };
        mask(personNames, 70);
    }
}
