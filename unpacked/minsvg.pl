#!/usr/bin/perl -w
# $Id$
#
# SVG minimizer

use strict;
use POSIX;

{
	my $input = $ARGV[0]; # input SVG file name
	my $rules = $ARGV[1]; # replace rules file
	open(RUL, "<$rules") or die "Could not open file - input rules file: $!";
	my @RULES;
	while(<RUL>) {
		chomp;
		push @RULES, $_;
	}
	close(RUL);
	my $nrules = floor (scalar (@RULES/3));


	my @OU;
	open(INP, "<$input") or die "Could not open file - input SVG file: $!";
	while(<INP>) {
		chomp;
		for (my $i = 0; $i < $nrules; $i++) {
			my $orig = @RULES[3*$i];
			my $new  = @RULES[3*$i+1];
			$_ =~ s/$orig/$new/;
		}
		$_ =~ s/^\s+//;
		$_ =~ s/<g/\n<g/;
		$_ =~ s/<\/svg>/\n<\/svg>/;
		$_ =~ s/transform=\"translate\(\d*\.?\d+,\d*\.?\d+\)\"//;
		if ($_) { push @OU, $_ };
	}
	close(INP);
	my $ret = join(" ", @OU);
	$ret =~ s/(<path.*?)id=".+?"(.*?\/>)/$1$2/g;
	$ret =~ s/\s?>/>/gm;
	$ret =~ s/\s?\/>/\/>/gm;
	$ret =~ s/>\s?</></gm;
	$ret =~ s/\s?$//gm;
	$ret =~ s/\s{2,}/ /gm;
	$ret =~ s/\s?\/>/\/>/gm;

	my @TMP;
	@TMP = split("\n", $ret);
	shift(@TMP);
	pop(@TMP);
	$ret = join("\n", @TMP);

	my $ret2 = <<EOD;
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="svg" height="0">

<style type="text/css"><![CDATA[
text { font-size:11pt; font-style:normal; font-variant:normal; font-weight:normal; font-stretch:normal; text-align:center; fill-opacity:1; font-family:"Helvetica"; }
path.l1 { fill:none;stroke:#000000;stroke-width:1;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-opacity:1;stroke-dasharray:none; }
path.l2 { fill:none;stroke:#000000;stroke-width:0.5;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-opacity:1;stroke-dasharray:none; }
path.l3 { color:#000000;fill:none;stroke:#000000;stroke-width:1;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-opacity:1;stroke-dasharray:1, 3;stroke-dashoffset:0;marker:none;visibility:visible;display:inline;overflow:visible; }
path.f3 { color:#000000;fill:#ffffc0;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1px;marker:none;visibility:visible;display:inline;overflow:visible; }
path.f4 { color:#000000;fill:#ffe0c0;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1px;marker:none;visibility:visible;display:inline;overflow:visible; }
path.f5 { color:#000000;fill:#c0e0ff;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1px;marker:none;visibility:visible;display:inline;overflow:visible; }
]]></style>

<defs><g id="wavetemps" style="display:none">

<!-- SVG template begins -->
EOD

	my $ret3 = <<EOD;

<!-- SVG template ends -->

</g></defs>
<g id="lanes"></g>
</svg>
EOD

	print ($ret2 . $ret . $ret3);
}
